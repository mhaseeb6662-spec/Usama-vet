import { prisma } from "@/lib/db";
import { cache } from "react";
import { mapProductToUI, mapCategoryToUI } from "./adapters";
import { toServedImageUrl } from "@/lib/mediaUrl";

// Helper to strip non-serializable Prisma types (Date, Decimal, BigInt)
// This prevents Next.js hydration crashes when passing data to Client Components
function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? Number(value) : value
  ));
}

// Cache these queries for the current request
// Each function has its own try/catch so a DB timeout never crashes the page
export const getActiveHeroSlides = cache(async () => {
  const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return serialize(slides).map((slide: any) => ({
      ...slide,
      desktopImage: toServedImageUrl(slide.desktopImage),
      mobileImage: toServedImageUrl(slide.mobileImage),
    }));
  
});

export const getHomepageCategories = cache(async () => {
  const cats = await prisma.category.findMany({
      where: { isActive: true, showOnHomepage: true },
      orderBy: { sortOrder: "asc" },
    });
    return cats.map(mapCategoryToUI);
  
});

export const getAllActiveCategories = cache(async () => {
  const cats = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return cats.map(mapCategoryToUI);
  
});

export const getActiveBanners = cache(async () => {
  const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return serialize(banners).map((banner: any) => ({
      ...banner,
      image: toServedImageUrl(banner.image),
      mobileImage: toServedImageUrl(banner.mobileImage),
    }));
  
});

export const getHomepageSections = cache(async () => {
  const sections = await prisma.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        category: true,
      }
    });
    return serialize(sections);
  
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

export const getHomepageProducts = cache(async () => {
  const include = { category: true, images: true, brand: true };
  const products = await prisma.product.findMany({ 
    where: { isActive: true }, 
    take: 100,
    include,
    orderBy: { createdAt: 'desc' }
  });
  
  const mapped = products.map(mapProductToUI);
  
  return {
    featured: mapped.filter(p => products.find(op => String(op.id) === p.id)?.isFeatured).slice(0, 8),
    newArrivals: mapped.filter(p => products.find(op => String(op.id) === p.id)?.isNewArrival).slice(0, 8),
    bestSellers: mapped.filter(p => products.find(op => String(op.id) === p.id)?.isBestSeller).slice(0, 8),
    recommended: mapped.filter(p => products.find(op => String(op.id) === p.id)?.isRecommended).slice(0, 8),
    trending: mapped.filter(p => products.find(op => String(op.id) === p.id)?.isTrending).slice(0, 8),
    all: mapped
  };
});
