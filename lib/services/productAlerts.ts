import { prisma } from "@/lib/db";
import { ensureCustomerSchema } from "@/lib/services/customerSchema";

export type ProductAlertKind = "NEW" | "UPDATED";

export function isMissingTableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /P2021|1146|ER_NO_SUCH_TABLE|doesn't exist|does not exist|no such table|unknown table/i.test(
    message
  );
}

export async function createProductAlert(
  productId: number,
  kind: ProductAlertKind,
  title: string
) {
  const name = title.trim();
  if (!name) {
    throw new Error("Product alert title is required.");
  }

  try {
    return await prisma.productAlert.create({
      data: { productId, kind, title: name },
    });
  } catch (error) {
    if (!isMissingTableError(error)) {
      throw error;
    }
    await ensureCustomerSchema();
    return prisma.productAlert.create({
      data: { productId, kind, title: name },
    });
  }
}

export async function deleteProductAlertsForProduct(productId: number) {
  try {
    await prisma.productAlert.deleteMany({ where: { productId } });
  } catch (error) {
    if (!isMissingTableError(error)) {
      throw error;
    }
  }
}

export async function getAlertsForCustomer(user: {
  lastAlertSeenAt: Date | null;
  createdAt: Date;
}) {
  await ensureCustomerSchema();
  const seenAt = user.lastAlertSeenAt ?? user.createdAt;
  const alerts = await prisma.productAlert.findMany({
    orderBy: { createdAt: "desc" },
    take: 40,
    include: {
      product: {
        select: {
          slug: true,
          name: true,
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { imageUrl: true },
          },
        },
      },
    },
  });

  return alerts.map((alert) => {
    if (!alert.product) {
      throw new Error(`Product alert ${alert.id} points to missing product ${alert.productId}.`);
    }
    return {
      id: alert.id,
      kind: alert.kind,
      title: alert.title,
      createdAt: alert.createdAt,
      unread: alert.createdAt > seenAt,
      productSlug: alert.product.slug,
      productName: alert.product.name,
      image: alert.product.images[0]?.imageUrl || "",
    };
  });
}

export async function getUnreadAlertCount(user: {
  lastAlertSeenAt: Date | null;
  createdAt: Date;
}) {
  await ensureCustomerSchema();
  const seenAt = user.lastAlertSeenAt ?? user.createdAt;
  return prisma.productAlert.count({
    where: { createdAt: { gt: seenAt } },
  });
}

export async function markAlertsSeen(userId: number) {
  await ensureCustomerSchema();
  return prisma.user.update({
    where: { id: userId },
    data: { lastAlertSeenAt: new Date() },
  });
}
