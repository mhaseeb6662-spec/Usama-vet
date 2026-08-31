"use client";
import React from "react";
import { Star } from "lucide-react";

export default function ReviewList({ reviews }: { reviews: any[] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 bg-white rounded-xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800">No Reviews Yet</h3>
        <p className="text-slate-500 mt-2">Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 mb-16">
      {reviews.map((review, idx) => (
        <div key={review.id} className={`py-6 flex gap-6 ${idx !== 0 ? 'border-t border-slate-100' : ''}`}>
          {/* Logo / Avatar */}
          <div className="w-16 h-16 shrink-0 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center p-2">
            <img src="/icons/icon-192x192.png" alt="Logo" className="w-full h-full object-contain opacity-60" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </div>

          <div className="flex-grow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 stroke-1"}`} />
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-800 text-[14px]">{review.displayName}</h4>
                  {review.isVerified && (
                    <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Verified</span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-[15px] mb-1.5">{review.title}</h3>
              </div>
              <span className="text-[12px] text-slate-400 shrink-0">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-slate-600 text-[14px] leading-relaxed">{review.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
