import React from "react";
import Link from "next/link";
import { MessageSquare, Star, ArrowRight } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { DEMO_REVIEWS } from "@/lib/data/mockData";
import ReviewCard from "@/components/reviews/ReviewCard";
import { BreadcrumbsSchema } from "@/lib/seo/schema";

export const metadata = {
  title: "Customer Reviews",
  description: `Read verified customer feedback, testimonials, and reviews for ${BUSINESS_CONFIG.name}. Find out why poultry owners, dairy farmers, and pet keepers trust us.`,
  alternates: {
    canonical: "/reviews",
  },
};

// ARCHITECTURAL TOGGLE: Set to true only when genuine, policy-compliant customer reviews exist.
// This prevents Google Search Console structured data warnings for empty/fake reviews.
const ENABLE_GENUINE_REVIEW_SCHEMA = false;

export default function ReviewsPage() {
  const reviews = DEMO_REVIEWS;
  const totalReviews = reviews.length;
  
  // Calculate average rating
  const averageRating = totalReviews > 0
    ? Number((reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1))
    : 0;

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Customer Reviews", item: "/reviews" },
  ];

  // Schema for reviews (only injected if flag is enabled)
  const renderReviewSchema = () => {
    if (!ENABLE_GENUINE_REVIEW_SCHEMA || totalReviews === 0) return null;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": BUSINESS_CONFIG.name,
      "@id": `${BUSINESS_CONFIG.url}/#product-reviews`,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": averageRating.toString(),
        "reviewCount": totalReviews.toString(),
        "bestRating": "5",
        "worstRating": "1",
      },
      "review": reviews.map((r) => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": r.userName,
        },
        "datePublished": r.date,
        "reviewBody": r.comment,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": r.rating.toString(),
          "bestRating": "5",
          "worstRating": "1",
        },
      })),
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Breadcrumb SEO Schema */}
      <BreadcrumbsSchema items={breadcrumbs} />
      
      {/* Conditional Review Schema */}
      {renderReviewSchema()}

      {/* PAGE HERO */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <nav className="flex justify-center text-xs uppercase tracking-wider font-semibold text-emerald-400 gap-2 mb-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Customer Reviews</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Customer Testimonials
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-light">
            We value feedback from our veterinary clients, commercial farmers, and pet parents. Here is what they say about our service.
          </p>
        </div>
      </section>

      {/* REVIEW DASHBOARD */}
      <section className="max-w-5xl mx-auto px-4 mt-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-10">
          {/* Average Rating Score Block */}
          <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6">
            <span className="block text-5xl font-extrabold text-slate-900 leading-none">
              {averageRating}
            </span>
            <div className="flex items-center justify-center gap-1 my-3" aria-label={`Average rating: ${averageRating} stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Based on {totalReviews} Mock Testimonials
            </span>
          </div>

          {/* Progress Bars (Star Breakdown) */}
          <div className="md:col-span-8 space-y-2">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
              Rating Distribution
            </h3>
            
            {/* 5 Stars */}
            <div className="flex items-center gap-3 text-xs">
              <span className="w-10 text-slate-600 font-medium">5 Star</span>
              <div className="flex-grow bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: "75%" }} />
              </div>
              <span className="w-8 text-right text-slate-500">75%</span>
            </div>

            {/* 4 Stars */}
            <div className="flex items-center gap-3 text-xs">
              <span className="w-10 text-slate-600 font-medium">4 Star</span>
              <div className="flex-grow bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: "25%" }} />
              </div>
              <span className="w-8 text-right text-slate-500">25%</span>
            </div>

            {/* 3, 2, 1 Stars */}
            {[3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-10 text-slate-400 font-medium">{stars} Star</span>
                <div className="flex-grow bg-slate-150 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-300 h-full rounded-full" style={{ width: "0%" }} />
                </div>
                <span className="w-8 text-right text-slate-400">0%</span>
              </div>
            ))}
          </div>
        </div>

        {/* REVIEWS GRID OR EMPTY STATE */}
        {totalReviews === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">No Reviews Yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              There are currently no reviews published. Check back later as we verify customer feedback.
            </p>
            <Link
              href="/contact"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow"
            >
              Write First Review
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Reviews Cards List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* PAGINATION / LOAD MORE ARCHITECTURE PLACEHOLDER */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
              <button
                disabled
                className="px-4 py-2 border border-slate-350 text-slate-400 bg-white rounded-lg cursor-not-allowed font-semibold transition-all focus:outline-none"
              >
                Previous
              </button>
              <span className="text-slate-500">
                Page <strong className="text-slate-800">1</strong> of <strong>1</strong>
              </span>
              <button
                disabled
                className="px-4 py-2 border border-slate-350 text-slate-400 bg-white rounded-lg cursor-not-allowed font-semibold transition-all focus:outline-none"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* CTA BANNER */}
      <section className="max-w-5xl mx-auto px-4 mt-16">
        <div className="bg-slate-950 text-white rounded-2xl p-8 relative overflow-hidden shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#047857_0%,transparent_30%)] opacity-30" />
          <div className="relative z-10 max-w-xl space-y-2">
            <h3 className="text-xl font-bold">Are You a Registered Customer?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your feedback is crucial for our improvement. If you have purchased animal health products or utilized our advisory desk, share your experience.
            </p>
          </div>
          <Link
            href="/contact?ref=review"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow shrink-0 relative z-10 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Submit a Review <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
