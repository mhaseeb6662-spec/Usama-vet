import React from "react";
import Link from "next/link";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewsSummary from "@/components/reviews/ReviewsSummary";
import ReviewList from "@/components/reviews/ReviewList";

export const metadata = {
  title: "Customer Reviews | Usama Vet",
  description: "Read genuine customer feedback and share your experience with Usama Vet's veterinary and animal-care products.",
};

export default function ReviewsPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      {/* HEADER BREADCRUMB */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="text-[12px] text-slate-500 flex gap-2">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Reviews</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <ReviewForm />
        <ReviewsSummary />
        <ReviewList />
      </div>
    </main>
  );
}
