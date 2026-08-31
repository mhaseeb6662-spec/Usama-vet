import { prisma } from "@/lib/db";
import { cache } from "react";
import { mapProductToUI, mapCategoryToUI } from "./adapters";

// Cache these queries for the current request
export const getActiveHeroSlides = cache(async () => {
  return prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
});

export const getHomepageCategories = cache(async () => {
  const cats = await prisma.category.findMany({
    where: { isActive: true, showOnHomepage: true },
    orderBy: { sortOrder: "asc" },
  });
  return cats.map(mapCategoryToUI);
});

export const getActiveBanners = cache(async () => {
  return prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
});

export const getHomepageSections = cache(async () => {
  return prisma.homepageSection.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      category: true,
    }
  });
});

export const getProductsBySection = cache(async (type: string, categoryId?: number | null, max: number = 8) => {
  const include = { category: true, images: true, brand: true };
  let products: any[] = [];
  
  switch (type) {
    case 'FEATURED':
      products = await prisma.product.findMany({ where: { isActive: true, isFeatured: true }, take: max, include });
      break;
    case 'NEW_ARRIVALS':
      products = await prisma.product.findMany({ where: { isActive: true, isNewArrival: true }, take: max, include, orderBy: { createdAt: 'desc' } });
      break;
    case 'BEST_SELLERS':
      products = await prisma.product.findMany({ where: { isActive: true, isBestSeller: true }, take: max, include });
      break;
    case 'RECOMMENDED':
      products = await prisma.product.findMany({ where: { isActive: true, isRecommended: true }, take: max, include });
      break;
    case 'TRENDING':
      products = await prisma.product.findMany({ where: { isActive: true, isTrending: true }, take: max, include });
      break;
    case 'CATEGORY':
      if (categoryId) {
        products = await prisma.product.findMany({ where: { isActive: true, categoryId }, take: max, include });
      }
      break;
  }
  
  return products.map(mapProductToUI);
});

