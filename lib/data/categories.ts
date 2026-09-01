import { cache } from "react";
import { prisma } from "@/lib/db";
import { mapProductToUI } from "@/lib/data/adapters";
import { ensureCategorySchema } from "@/lib/services/categorySchema";
import type { Product as UIProduct } from "@/types";

export class CategoryApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "CategoryApplicationError";
  }
}

export type CategoryListing = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  products: UIProduct[];
};

export const getCategoryListing = cache(async (slug: string): Promise<CategoryListing | null> => {
  const normalized = slug.trim();
  if (!normalized) {
    throw new CategoryApplicationError("Category is required.", 400);
  }

  await ensureCategorySchema();

  const category = await prisma.category.findUnique({
    where: { slug: normalized },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      isActive: true,
    },
  });

  if (!category || !category.isActive) {
    return null;
  }

  const products = await prisma.product.findMany({
    where: { isActive: true, categoryId: category.id },
    include: { images: true, category: true, brand: true },
    orderBy: { createdAt: "desc" },
    take: 48,
  });

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    products: products.map(mapProductToUI),
  };
});
