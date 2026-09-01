import { prisma } from "@/lib/db";
import { cache } from "react";
import { mapProductToUI, mapCategoryToUI } from "./adapters";

// Cache these queries for the current request
// Each function has its own try/catch so a DB timeout never crashes the page
export const getActiveHeroSlides = cache(async () => {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return slides.map(s => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error("[DB] getActiveHeroSlides failed:", error);
    return [];
  }
});

export const getHomepageCategories = cache(async () => {
  try {
    const cats = await prisma.category.findMany({
      where: { isActive: true, showOnHomepage: true },
      orderBy: { sortOrder: "asc" },
    });
    return cats.map(mapCategoryToUI);
  } catch (error) {
    console.error("[DB] getHomepageCategories failed:", error);
    return [];
  }
});

export const getAllActiveCategories = cache(async () => {
  try {
    const cats = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return cats.map(mapCategoryToUI);
  } catch (error) {
    console.error("[DB] getAllActiveCategories failed:", error);
    return [];
  }
});

export const getActiveBanners = cache(async () => {
  try {
    return await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("[DB] getActiveBanners failed:", error);
    return [];
  }
});

export const getHomepageSections = cache(async () => {
  try {
    return await prisma.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        category: true,
      }
    });
  } catch (error) {
    console.error("[DB] getHomepageSections failed:", error);
    return [];
  }
});

export const getProductsBySection = cache(async (type: string, categoryId?: number | null, max: number = 8) => {
  try {
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
  } catch (error) {
    console.error("[DB] getProductsBySection failed:", error);
    return [];
  }
});
