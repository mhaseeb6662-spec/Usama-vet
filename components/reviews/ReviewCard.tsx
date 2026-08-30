import React from "react";
import { Star, CheckCircle } from "lucide-react";
import { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { userName, userDesignation, rating, comment, date, verifiedPurchase } = review;

  // Format date if present
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // Get initials for Avatar placeholder
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-[3px] transition-all duration-200 ease-out flex flex-col h-full group/reviewCard">
      {/* Header section with User Info & Rating */}
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar Placeholder */}
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0 group-hover/reviewCard:scale-[1.05] transition-transform duration-200 ease-out">
            {getInitials(userName)}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-[13px] leading-snug">
              {userName}
            </h4>
            {userDesignation && (
              <span className="text-[11px] text-slate-500 font-normal block mt-0.5">
                {userDesignation}
              </span>
            )}
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Review Comment */}
      <p className="text-slate-655 text-[13px] leading-normal flex-grow italic mb-4 font-normal">
        &ldquo;{comment}&rdquo;
      </p>

      {/* Footer Info */}
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-normal">
        {formattedDate && <time dateTime={date}>{formattedDate}</time>}
        
        {verifiedPurchase && (
          <span className="flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
            <CheckCircle className="w-3 h-3" /> Verified Purchase
          </span>
        )}
      </div>
    </div>
  );
}
