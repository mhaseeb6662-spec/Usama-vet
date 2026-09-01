import { NextResponse } from "next/server";
import {
  getHomepageCatalog,
  getHomepageCategories,
  getActiveHeroSlides,
  getActiveBanners,
} from "@/lib/data/homepage";
import { getApprovedHomeReviews } from "@/lib/data/reviews";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [catalog, heroSlides, banners, categories, reviews] = await Promise.all([
      getHomepageCatalog(),
      getActiveHeroSlides(),
      getActiveBanners(),
      getHomepageCategories(),
      getApprovedHomeReviews(),
    ]);

    return NextResponse.json({
      success: true,
      data: { catalog, heroSlides, banners, categories, reviews },
    });
  } catch (error) {
    console.error("[home] GET failed:", error);
    return NextResponse.json(
      { success: false, message: "Could not load the store homepage." },
      { status: 500 }
    );
  }
}
