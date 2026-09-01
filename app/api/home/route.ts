import { NextResponse } from "next/server";
import {
  getHomepageCatalog,
  getHomepageCategories,
  getActiveHeroSlides,
  getActiveBanners,
} from "@/lib/data/homepage";
import { getApprovedHomeReviews } from "@/lib/data/reviews";

export const dynamic = "force-dynamic";

const HOME_CACHE_MS = 30_000;
const HOME_CACHE_HEADERS = {
  "Cache-Control": "public, max-age=15, s-maxage=30, stale-while-revalidate=120",
};

type HomeData = {
  catalog: unknown;
  heroSlides: unknown;
  banners: unknown;
  categories: unknown;
  reviews: unknown;
};

let homeCache: { expiresAt: number; data: HomeData } | null = null;

export async function GET() {
  if (homeCache && homeCache.expiresAt > Date.now()) {
    return NextResponse.json(
      { success: true, data: homeCache.data },
      { headers: HOME_CACHE_HEADERS }
    );
  }

  try {
    const [catalog, heroSlides, banners, categories, reviews] = await Promise.all([
      getHomepageCatalog(),
      getActiveHeroSlides(),
      getActiveBanners(),
      getHomepageCategories(),
      getApprovedHomeReviews(),
    ]);

    const data = { catalog, heroSlides, banners, categories, reviews };
    homeCache = { expiresAt: Date.now() + HOME_CACHE_MS, data };

    return NextResponse.json(
      { success: true, data },
      { headers: HOME_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("[home] GET failed:", error);
    return NextResponse.json(
      { success: false, message: "Could not load the store homepage." },
      { status: 500 }
    );
  }
}
