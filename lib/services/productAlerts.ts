import { prisma } from "@/lib/db";
import { ensureCustomerSchema } from "@/lib/services/customerSchema";

export type ProductAlertKind = "NEW" | "UPDATED";

export async function createProductAlert(
  productId: number,
  kind: ProductAlertKind,
  title: string
) {
  await ensureCustomerSchema();
  const name = title.trim();
  if (!name) {
    throw new Error("Product alert title is required.");
  }
  return prisma.productAlert.create({
    data: { productId, kind, title: name },
  });
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
