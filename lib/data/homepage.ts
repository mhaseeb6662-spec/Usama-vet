import { prisma } from "@/lib/db";
import { cache } from "react";
import { mapProductToUI, mapCategoryToUI } from "./adapters";
import { isPersistentPublicImage, toServedImageUrl } from "@/lib/mediaUrl";

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (_, value) =>
    typeof value === "bigint" ? Number(value) : value
  ));
}

export const getActiveHeroSlides = cache(async () => {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return serialize(slides).map((slide: any) => {
      const desktopImage = toServedImageUrl(slide.desktopImage);
      const mobileImage = toServedImageUrl(slide.mobileImage);
      return {
        ...slide,
        desktopImage: isPersistentPublicImage(desktopImage) ? desktopImage : null,
        mobileImage: isPersistentPublicImage(mobileImage) ? mobileImage : null,
      };
    });
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
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return serialize(banners).map((banner: any) => {
      const image = toServedImageUrl(banner.image);
      const mobileImage = toServedImageUrl(banner.mobileImage);
      return {
        ...banner,
        image: isPersistentPublicImage(image) ? image : "",
        mobileImage: isPersistentPublicImage(mobileImage) ? mobileImage : "",
      };
    });
  } catch (error) {
    console.error("[DB] getActiveBanners failed:", error);
    return [];
  }
});

export const getHomepageSections = cache(async () => {
  try {
    const sections = await prisma.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        category: true,
      },
    });
    return serialize(sections);
  } catch (error) {
    console.error("[DB] getHomepageSections failed:", error);
    return [];
  }
});

export const getHomepageCatalog = cache(async () => {
  const empty = {
    featured: [],
    newArrivals: [],
    bestSellers: [],
    recommended: [],
    trending: [],
    livestock: [],
    petCare: [],
    supplements: [],
  };

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { isFeatured: true },
          { isNewArrival: true },
          { isBestSeller: true },
          { isRecommended: true },
          { isTrending: true },
          { category: { slug: { in: ["livestock-care", "pet-care", "animal-supplements"] } } },
        ],
      },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 2 },
        category: true,
        brand: true,
      },
      orderBy: { createdAt: "desc" },
      take: 120,
    });

    const toCards = (items: typeof products) => {
      const cards = [];
      for (const item of items) {
        try {
          cards.push(mapProductToUI(item));
        } catch (error) {
          console.error("[DB] Product card mapping failed:", error);
        }
      }
      return cards.slice(0, 8);
    };

    return {
      featured: toCards(products.filter((item) => item.isFeatured)),
      newArrivals: toCards(products.filter((item) => item.isNewArrival)),
      bestSellers: toCards(products.filter((item) => item.isBestSeller)),
      recommended: toCards(products.filter((item) => item.isRecommended)),
      trending: toCards(products.filter((item) => item.isTrending)),
      livestock: toCards(products.filter((item) => item.category?.slug === "livestock-care")),
      petCare: toCards(products.filter((item) => item.category?.slug === "pet-care")),
      supplements: toCards(products.filter((item) => item.category?.slug === "animal-supplements")),
    };
  } catch (error) {
    console.error("[DB] getHomepageCatalog failed:", error);
    return empty;
  }
});

export const getHomepageProducts = getHomepageCatalog;

export const getProductsBySection = cache(async (type: string, categoryId?: number | null, max: number = 8) => {
  try {
    const include = { category: true, images: true, brand: true };
    let products: any[] = [];

    switch (type) {
      case "FEATURED":
        products = await prisma.product.findMany({ where: { isActive: true, isFeatured: true }, take: max, include });
        break;
      case "NEW_ARRIVALS":
        products = await prisma.product.findMany({ where: { isActive: true, isNewArrival: true }, take: max, include, orderBy: { createdAt: "desc" } });
        break;
      case "BEST_SELLERS":
        products = await prisma.product.findMany({ where: { isActive: true, isBestSeller: true }, take: max, include });
        break;
      case "RECOMMENDED":
        products = await prisma.product.findMany({ where: { isActive: true, isRecommended: true }, take: max, include });
        break;
      case "TRENDING":
        products = await prisma.product.findMany({ where: { isActive: true, isTrending: true }, take: max, include });
        break;
      case "CATEGORY":
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
