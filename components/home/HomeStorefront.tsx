"use client";

import React, { useEffect, useState } from "react";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryScroller from "@/components/home/CategoryScroller";
import TrustStrip from "@/components/home/TrustStrip";
import PromoBanner from "@/components/home/PromoBanner";
import ProductTabs from "@/components/home/ProductTabs";
import ReviewsSection from "@/components/home/ReviewsSection";
import PromoSearchSection from "@/components/home/PromoSearchSection";
import ProductSection from "@/components/home/ProductSection";
import LowerTrustStrip from "@/components/home/LowerTrustStrip";
import NewsletterSection from "@/components/home/NewsletterSection";

const EMPTY_CATALOG = {
  featured: [],
  newArrivals: [],
  bestSellers: [],
  recommended: [],
  trending: [],
  livestock: [],
  petCare: [],
  supplements: [],
};

type HomePayload = {
  catalog: typeof EMPTY_CATALOG;
  heroSlides: any[];
  banners: any[];
  categories: any[];
  reviews: any[];
};

export default function HomeStorefront() {
  const [data, setData] = useState<HomePayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadHome = () => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 12000);
    setLoading(true);
    setError("");
    fetch("/api/home", { signal: controller.signal })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok || !payload.success) {
          throw new Error(payload.message || "Could not load the store homepage.");
        }
        setData(payload.data);
      })
      .catch((err) => {
        console.error(err);
        setData(null);
        if (err instanceof DOMException && err.name === "AbortError") {
          setError("The store took too long to load. Please try again.");
          return;
        }
        setError(err instanceof Error ? err.message : "Could not load the store homepage.");
      })
      .finally(() => {
        window.clearTimeout(timer);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadHome();
  }, []);

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <div className="w-full min-h-[220px] sm:min-h-[320px] bg-slate-200" />
        <div className="px-4 py-8 text-center">
          <p className="text-slate-800 font-semibold text-lg">Loading Usama Vet...</p>
          <p className="text-slate-500 text-sm mt-2">Products and offers are loading.</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Store Could Not Load</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            type="button"
            onClick={loadHome}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const catalog = data?.catalog || EMPTY_CATALOG;
  const dbHeroSlides = data?.heroSlides || [];
  const dbBanners = data?.banners || [];
  const homepageCategories = data?.categories || [];
  const approvedReviews = data?.reviews || [];
  const promo1 = dbBanners.find((banner) => banner.position === "promo-1");
  const promo2 = dbBanners.find((banner) => banner.position === "promo-2");

  return (
    <div className="space-y-4">
      <HeroCarousel slides={dbHeroSlides} />
      <CategoryScroller categories={homepageCategories} />
      <TrustStrip />
      <PromoBanner image={promo1?.image} />
      <ProductTabs
        featuredProducts={catalog.featured}
        newArrivals={catalog.newArrivals}
        bestSellers={catalog.bestSellers}
      />
      <ReviewsSection reviews={approvedReviews} />
      <PromoSearchSection />
      <ProductSection
        preTitle="Fresh Catalog"
        title="New Arrivals"
        description="Explore the latest additions to our animal pharmacy and feed reserves. Verified for safety."
        products={catalog.newArrivals}
        bgColorClass="bg-white/70 backdrop-blur-md"
        viewAllHref="/#products"
      />
      <ProductSection
        preTitle="Top Demand"
        title="Best Selling Products"
        description="Our most popular veterinary medicines and enhancers, trusted by commercial dairy farms nationwide."
        products={catalog.bestSellers}
        bgColorClass="bg-emerald-50/70 backdrop-blur-md"
        viewAllHref="/#products"
      />
      <ProductSection
        preTitle="Cattle & Sheep"
        title="Livestock Essentials"
        description="Heavy-duty healthcare, deworming drenches, and milk production boosts for dairy herds."
        products={catalog.livestock}
        bgColorClass="bg-white/70 backdrop-blur-md"
        viewAllHref="/categories/livestock-care"
      />
      <ProductSection
        preTitle="Personalized Picks"
        title="Recommended For You"
        description="Specially configured combinations of trace minerals and farm hygiene products for active keepers."
        products={catalog.recommended}
        bgColorClass="bg-cyan-50/70 backdrop-blur-md"
        viewAllHref="/#products"
      />
      <PromoBanner image={promo2?.image} />
      <ProductSection
        preTitle="Dogs, Cats & Birds"
        title="Pet & Animal Care"
        description="Premium skin oils, hair fall control supplements, and flea/tick sprays for companion animals."
        products={catalog.petCare}
        bgColorClass="bg-white/70 backdrop-blur-md"
        viewAllHref="/categories/pet-care"
      />
      <ProductSection
        preTitle="Nutrition & Growth"
        title="Veterinary Supplements"
        description="High concentration vitamin AD3E injections, mycotoxin binders, and digestive rumen yeast premixes."
        products={catalog.supplements}
        bgColorClass="bg-teal-50/70 backdrop-blur-md"
        viewAllHref="/categories/animal-supplements"
      />
      <ProductSection
        preTitle="Market Pulse"
        title="Trending Now"
        description="Rapidly moving vaccines, ear tag guns, and biosecurity spray disinfectants across major farms."
        products={catalog.trending}
        bgColorClass="bg-white/70 backdrop-blur-md"
        viewAllHref="/#products"
      />
      <LowerTrustStrip />
      <NewsletterSection />
    </div>
  );
}
