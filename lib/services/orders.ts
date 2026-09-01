import { prisma } from "@/lib/db";
import { checkoutSchema, normalizePakistanPhone, trackOrderSchema, type CheckoutInput } from "@/lib/validators/order";
import { quoteCartItems } from "@/lib/services/cartQuote";
import { ensureOrderSchema } from "@/lib/services/orderSchema";
import {
  ALLOWED_STATUS_TRANSITIONS,
  type OrderStatusValue,
  type PaymentStatusValue,
} from "@/lib/constants/checkout";

export class OrderApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "OrderApplicationError";
  }
}

function generateOrderNumber(): string {
  const now = new Date();
  const date = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}`;
  const suffix = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
  return `ORD-${date}-${suffix}`;
}

export async function placeOrder(raw: unknown) {
  await ensureOrderSchema();
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    throw new OrderApplicationError(
      parsed.error.issues[0]?.message || "Please check your order details.",
      400,
      parsed.error.flatten()
    );
  }

  const input: CheckoutInput = parsed.data;
  const quote = await quoteCartItems(input.items);
  if (!quote.canCheckout) {
    const firstError = quote.items.find((item) => item.error)?.error;
    throw new OrderApplicationError(
      firstError || "Your cart has items that cannot be ordered.",
      409,
      quote.items
    );
  }

  const phone = normalizePakistanPhone(input.phone);
  const whatsapp = input.whatsapp ? normalizePakistanPhone(input.whatsapp) : null;

  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const item of quote.items) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            isActive: true,
            stockQuantity: { gte: item.quantity },
          },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        if (updated.count !== 1) {
          throw new OrderApplicationError(
            `${item.name} does not have enough stock.`,
            409
          );
        }
      }

      let created = null;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          created = await tx.order.create({
            data: {
              orderNumber: generateOrderNumber(),
              customerName: input.customerName,
              phone,
              whatsapp,
              email: input.email || null,
              city: input.city,
              area: input.area || null,
              address: input.address,
              landmark: input.landmark || null,
              notes: input.notes || null,
              subtotal: quote.subtotal,
              shippingFee: quote.shippingFee,
              discount: quote.discount,
              total: quote.total,
              paymentMethod: "COD",
              paymentStatus: "UNPAID",
              status: "PENDING",
              stockRestored: false,
              items: {
                create: quote.items.map((item) => ({
                  productId: item.productId,
                  productNameSnapshot: item.name,
                  skuSnapshot: item.sku,
                  imageSnapshot: item.image || null,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  totalPrice: item.unitPrice * item.quantity,
                })),
              },
            },
            include: { items: true },
          });
          break;
        } catch (error) {
          const message = error instanceof Error ? error.message : "";
          if (!message.includes("orderNumber") || attempt === 4) {
            throw error;
          }
        }
      }

      if (!created) {
        throw new OrderApplicationError("Could not generate a unique order number.", 500);
      }

      return created;
    });

    return order;
  } catch (error) {
    if (error instanceof OrderApplicationError) {
      throw error;
    }
    console.error("[orders] placeOrder failed:", error);
    throw new OrderApplicationError("We couldn't place your order. Please try again.", 500);
  }
}

export async function trackOrder(raw: unknown) {
  await ensureOrderSchema();
  const parsed = trackOrderSchema.safeParse(raw);
  if (!parsed.success) {
    throw new OrderApplicationError(parsed.error.issues[0]?.message || "Invalid tracking details.", 400);
  }

  const phone = normalizePakistanPhone(parsed.data.phone);
  const order = await prisma.order.findFirst({
    where: {
      orderNumber: parsed.data.orderNumber.trim(),
      phone,
    },
    include: {
      items: {
        select: {
          productNameSnapshot: true,
          quantity: true,
          unitPrice: true,
          totalPrice: true,
        },
      },
    },
  });

  if (!order) {
    throw new OrderApplicationError("No order matched that number and phone.", 404);
  }

  return {
    orderNumber: order.orderNumber,
    createdAt: order.createdAt,
    status: order.status,
    total: Number(order.total),
    paymentMethod: order.paymentMethod,
    items: order.items.map((item) => ({
      name: item.productNameSnapshot,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
    })),
  };
}

export async function getOrderForReceipt(orderNumber: string) {
  await ensureOrderSchema();
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
}

export async function updateOrderStatus(orderId: number, nextStatus: OrderStatusValue) {
  await ensureOrderSchema();
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) {
    throw new OrderApplicationError("Order was not found.", 404);
  }

  const current = order.status as OrderStatusValue;
  if (!ALLOWED_STATUS_TRANSITIONS[current].includes(nextStatus)) {
    throw new OrderApplicationError(
      `Cannot change a ${current} order to ${nextStatus}.`,
      409
    );
  }

  if (nextStatus === "CANCELLED") {
    return prisma.$transaction(async (tx) => {
      if (!order.stockRestored) {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        }
      }
      return tx.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED", stockRestored: true },
        include: { items: true },
      });
    });
  }

  return prisma.order.update({
    where: { id: order.id },
    data: { status: nextStatus },
    include: { items: true },
  });
}

export async function updatePaymentStatus(orderId: number, paymentStatus: PaymentStatusValue) {
  await ensureOrderSchema();
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new OrderApplicationError("Order was not found.", 404);
  }
  if (order.status === "CANCELLED") {
    throw new OrderApplicationError("A cancelled order cannot be marked paid.", 409);
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus },
  });
}
