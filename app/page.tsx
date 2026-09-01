import React from "react";
import { OrganizationSchema, WebSiteSchema } from "@/lib/seo/schema";
import { 
  getHomepageCatalog,
  getHomepageCategories,
  getActiveHeroSlides,
  getActiveBanners
} from "@/lib/data/homepage";

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

// Force dynamic rendering so Next.js doesn't try to query the database during Hostinger's build step
export const revalidate = 60;

export default async function HomePage() {
  // Try fetching dynamic data, fallback to mock data if database is empty/unseeded
  // All query functions have built-in try/catch and return [] on DB failure
  const [catalog, dbHeroSlides, dbBanners, homepageCategories] = await Promise.all([
    getHomepageCatalog(),
    getActiveHeroSlides(),
    getActiveBanners(),
    getHomepageCategories(),
  ]);

  const dbFeatured = catalog.featured;
  const newArrivals = catalog.newArrivals;
  const bestSellers = catalog.bestSellers;
  const recommended = catalog.recommended;
  const trending = catalog.trending;
  const livestockEssentials = catalog.livestock;
  const petCareEssentials = catalog.petCare;
  const supplementsEssentials = catalog.supplements;

  const promo1 = dbBanners.find(b => b.position === "promo-1");
  const promo2 = dbBanners.find(b => b.position === "promo-2");

  return (
    <div className="space-y-4">
      {/* Dynamic SEO JSON-LD Scripts */}
      <OrganizationSchema />
      <WebSiteSchema />

      {/* 1. HERO CAROUSEL BANNER */}
      <HeroCarousel slides={dbHeroSlides} />

      {/* 2. CIRCULAR CATEGORY SCROLLER */}
      {homepageCategories && homepageCategories.length > 0 && (
        <CategoryScroller categories={homepageCategories} />
      )}

      {/* 3. UPPER TRUST STRIP (3 boxes) */}
      <TrustStrip />

      {/* 4. FIRST PROMOTIONAL BANNER */}
      <PromoBanner
        badgeText={promo1 ? promo1.name : "Special Campaign"}
        title={promo1?.title || "Amazing Offers Inside: Save up to 20% on Veterinary Medicines"}
        subTitle={promo1?.subtitle || "Get premium antibiotics, dewormers and cattle calcium injections at direct farm rates. Temperature controlled shipping included."}
        bgClass={promo1?.image ? "bg-cover bg-center" : "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500"}
        textClass="text-slate-950 font-sans"
        href={promo1?.ctaUrl || "#products"}
        style={promo1?.image ? { backgroundImage: `url(${promo1.image})` } : undefined}
      />

      {/* 5. TAB CONTROLLED GRID (Featured, New, Best Selling) */}
      <ProductTabs 
        featuredProducts={dbFeatured} 
        newArrivals={newArrivals} 
        bestSellers={bestSellers} 
      />

      {/* 6. CLIENT TESTIMONIALS SECTION (4 cards) */}
      <ReviewsSection />

      {/* 7. LARGE GREEN SEARCH CTA WITH URDU HEADER */}
      <PromoSearchSection />

      {/* 8. SECTION A: NEW ARRIVALS (bg-white) */}
      <ProductSection
        preTitle="Fresh Catalog"
        title="New Arrivals"
        description="Explore the latest additions to our animal pharmacy and feed reserves. Verified for safety."
        products={newArrivals}
        bgColorClass="bg-white/70 backdrop-blur-md"
        viewAllHref="/#products"
      />

      {/* 9. SECTION B: BEST SELLING PRODUCTS (bg-emerald-50/15, light green) */}
      <ProductSection
        preTitle="Top Demand"
        title="Best Selling Products"
        description="Our most popular veterinary medicines and enhancers, trusted by commercial dairy farms nationwide."
        products={bestSellers}
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
        products={recommended}
        bgColorClass="bg-cyan-50/70 backdrop-blur-md"
        viewAllHref="/#products"
      />

      {/* 12. SECOND PROMOTIONAL BANNER */}
      <PromoBanner
        badgeText={promo2 ? promo2.name : "Seasonal Boost"}
        title={promo2?.title || "Best Offers of the Season: Nutritional Dairy Enhancers"}
        subTitle={promo2?.subtitle || "Enhance daily milk fat percentage and protect cattle from ketosis. Secure dry-pack casing on bulk orders."}
        bgClass={promo2?.image ? "bg-cover bg-center" : "bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-850"}
        textClass="text-white"
        href={promo2?.ctaUrl || "#products"}
        style={promo2?.image ? { backgroundImage: `url(${promo2.image})` } : undefined}
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
        products={trending}
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

