import React from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import ReviewCard from "@/components/reviews/ReviewCard";
import { DEMO_REVIEWS } from "@/lib/data/mockData";

export default function ReviewsSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Testimonials section header */}
      <SectionHeader
        preTitle="Testimonials"
        title="WHAT OUR CLIENTS SAY"
        description="Discover how Usama Vet Care is supporting dairy farmers, livestock breeders, and pet keepers with authentic product delivery. Testimonials shown are mock records."
      />

      {/* Grid of 4 Testimonial cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {DEMO_REVIEWS.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
