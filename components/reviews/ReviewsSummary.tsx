import React from "react";
import { Star } from "lucide-react";

export default function ReviewsSummary() {
  const totalReviews = 363;
  const avgRating = 4.90;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-10 mb-8 max-w-4xl mx-auto">
      <h2 className="text-center text-[22px] font-bold text-slate-900 mb-6">Customer Reviews</h2>
      
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={`w-6 h-6 ${star <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
          ))}
          <span className="text-[18px] font-bold text-slate-900 ml-2">{avgRating.toFixed(2)} out of 5</span>
        </div>
        <p className="text-[13px] text-slate-500">Based on {totalReviews} reviews</p>
      </div>

      <div className="max-w-md mx-auto space-y-3">
        {[
          { stars: 5, count: 331, percent: 91 },
          { stars: 4, count: 30, percent: 8 },
          { stars: 3, count: 1, percent: 0.5 },
          { stars: 2, count: 0, percent: 0 },
          { stars: 1, count: 0, percent: 0 },
        ].map((row) => (
          <div key={row.stars} className="flex items-center gap-4 text-[13px]">
            <div className="flex items-center gap-1 w-24">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-3.5 h-3.5 ${star <= row.stars ? "fill-amber-400 text-amber-400" : "text-slate-200 stroke-1"}`} />
              ))}
            </div>
            <div className="flex-grow bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${row.percent}%` }} />
            </div>
            <span className="w-8 text-right text-slate-400">{row.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
