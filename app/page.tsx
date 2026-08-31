import React from "react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { MOCK_PRODUCTS } from "@/lib/data/mockData";
import { OrganizationSchema, WebSiteSchema } from "@/lib/seo/schema";

// Modular Components
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

export default function HomePage() {
  // Filter products for custom sections
  const livestockEssentials = MOCK_PRODUCTS.filter(
    (p) => p.categorySlug === "livestock-care" || p.categorySlug === "veterinary-medicines"
  );
  
  const petCareEssentials = MOCK_PRODUCTS.filter(
    (p) => p.categorySlug === "pet-care"
  );

  const supplementsEssentials = MOCK_PRODUCTS.filter(
    (p) => p.categorySlug === "animal-supplements" || p.categorySlug === "feed-supplements"
  );

  return (
    <div className="space-y-4">
      {/* Dynamic SEO JSON-LD Scripts */}
      <OrganizationSchema />
      <WebSiteSchema />

      {/* 1. HERO CAROUSEL BANNER */}
      <HeroCarousel />

      {/* 2. CIRCULAR CATEGORY SCROLLER */}
      <CategoryScroller />

      {/* 3. UPPER TRUST STRIP (3 boxes) */}
      <TrustStrip />

      {/* 4. FIRST PROMOTIONAL BANNER */}
      <PromoBanner
        badgeText="Special Campaign"
        title="Amazing Offers Inside: Save up to 20% on Veterinary Medicines"
        subTitle="Get premium antibiotics, dewormers and cattle calcium injections at direct farm rates. Temperature controlled shipping included."
        bgClass="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500"
        textClass="text-slate-950 font-sans"
        href="#products"
      />

      {/* 5. TAB CONTROLLED GRID (Featured, New, Best Selling) */}
      <ProductTabs />

      {/* 6. CLIENT TESTIMONIALS SECTION (4 cards) */}
      <ReviewsSection />

      {/* 7. LARGE GREEN SEARCH CTA WITH URDU HEADER */}
      <PromoSearchSection />

      {/* 8. SECTION A: NEW ARRIVALS (bg-white) */}
      <ProductSection
        preTitle="Fresh Catalog"
        title="New Arrivals"
        description="Explore the latest additions to our animal pharmacy and feed reserves. Verified for safety."
        products={MOCK_PRODUCTS.slice(0, 8)}
        bgColorClass="bg-white/70 backdrop-blur-md"
        viewAllHref="/#products"
      />

      {/* 9. SECTION B: BEST SELLING PRODUCTS (bg-emerald-50/15, light green) */}
      <ProductSection
        preTitle="Top Demand"
        title="Best Selling Products"
        description="Our most popular veterinary medicines and enhancers, trusted by commercial dairy farms nationwide."
        products={MOCK_PRODUCTS.slice(8, 16)}
        bgColorClass="bg-emerald-50/70 backdrop-blur-md"
        viewAllHref="/#products"
      />

      {/* 10. SECTION C: LIVESTOCK ESSENTIALS (bg-white) */}
      <ProductSection
        preTitle="Cattle & Sheep"
        title="Livestock Essentials"
        description="Heavy-duty healthcare, deworming drenches, and milk production boosts for dairy herds."
        products={livestockEssentials}
        bgColorClass="bg-white/70 backdrop-blur-md"
        viewAllHref="/categories/livestock-care"
      />

      {/* 11. SECTION D: RECOMMENDED FOR YOU (bg-cyan-50/15, light blue) */}
      <ProductSection
        preTitle="Personalized Picks"
        title="Recommended For You"
        description="Specially configured combinations of trace minerals and farm hygiene products for active keepers."
        products={MOCK_PRODUCTS.slice(12, 20)}
        bgColorClass="bg-cyan-50/70 backdrop-blur-md"
        viewAllHref="/#products"
      />

      {/* 12. SECOND PROMOTIONAL BANNER */}
      <PromoBanner
        badgeText="Seasonal Boost"
        title="Best Offers of the Season: Nutritional Dairy Enhancers"
        subTitle="Enhance daily milk fat percentage and protect cattle from ketosis. Secure dry-pack casing on bulk orders."
        bgClass="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-850"
        textClass="text-white"
        href="#products"
      />

      {/* 13. SECTION E: PET & ANIMAL CARE (bg-white) */}
      <ProductSection
        preTitle="Dogs, Cats & Birds"
        title="Pet & Animal Care"
        description="Premium skin oils, hair fall control supplements, and flea/tick sprays for companion animals."
        products={petCareEssentials}
        bgColorClass="bg-white/70 backdrop-blur-md"
        viewAllHref="/categories/pet-care"
      />

      {/* 14. SECTION F: VETERINARY SUPPLEMENTS (bg-teal-50/15, light aqua) */}
      <ProductSection
        preTitle="Nutrition & Growth"
        title="Veterinary Supplements"
        description="High concentration vitamin AD3E injections, mycotoxin binders, and digestive rumen yeast premixes."
        products={supplementsEssentials}
        bgColorClass="bg-teal-50/70 backdrop-blur-md"
        viewAllHref="/categories/animal-supplements"
      />

      {/* 15. SECTION G: TRENDING NOW (bg-white) */}
      <ProductSection
        preTitle="Market Pulse"
        title="Trending Now"
        description="Rapidly moving vaccines, ear tag guns, and biosecurity spray disinfectants across major farms."
        products={MOCK_PRODUCTS.slice(16, 24)}
        bgColorClass="bg-white/70 backdrop-blur-md"
        viewAllHref="/#products"
      />

      {/* 16. LOWER TRUST STRIP (4 boxes) */}
      <LowerTrustStrip />

      {/* 17. NEWSLETTER PRE-FOOTER */}
      <NewsletterSection />
    </div>
  );
}
