import { prisma } from "@/lib/db";
import { mapProductToUI } from "@/lib/data/adapters";
import type { Product as UIProduct } from "@/types";

export class SearchApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "SearchApplicationError";
  }
}

export function normalizeSearchQuery(raw: unknown): string {
  if (typeof raw !== "string") {
    throw new SearchApplicationError("Enter a search term.", 400);
  }
  const query = raw.trim().replace(/\s+/g, " ");
  if (query.length < 2) {
    throw new SearchApplicationError("Enter at least 2 characters to search.", 400);
  }
  return query;
}

export async function searchProducts(rawQuery: unknown, limit = 40): Promise<UIProduct[]> {
  const query = normalizeSearchQuery(rawQuery);
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query } },
        { sku: { contains: query } },
        { shortDescription: { contains: query } },
        { description: { contains: query } },
        { focusKeyword: { contains: query } },
        { category: { name: { contains: query } } },
        { brand: { name: { contains: query } } },
      ],
    },
    include: { images: true, category: true, brand: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(mapProductToUI);
}
