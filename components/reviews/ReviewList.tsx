"use client";
import React from "react";
import { Star } from "lucide-react";

export default function ReviewList() {
  const mockReviews = [
    {
      id: 1,
      name: "Sanazehra Kazim",
      verified: true,
      title: "Nice products",
      content: "Products reasonable price mn hn r jsi dkhai hn wsi he hn,thnq qadri gadgets",
      date: "28/08/2026",
      rating: 5,
    },
    {
      id: 2,
      name: "Salman Raza",
      verified: true,
      title: "Nice quality, best rates",
      content: "Order received on time.. no defect.. best service , happy for decreasing DC rates.. will shop again",
      date: "28/08/2026",
      rating: 4,
    },
    {
      id: 3,
      name: "Marry",
      verified: true,
      title: "Good Experience as always",
      content: "All items are good and perfect for everyday use .. Keep bringing in new and different items in stock like this.",
      date: "28/08/2026",
      rating: 5,
    },
    {
      id: 4,
      name: "Syeda",
      verified: true,
      title: "Authentic seller",
      content: "Everything is good quality and received on time. Have been shopping from some years back.still amazing as always ??",
      date: "28/08/2026",
      rating: 5,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 mb-16">
      {mockReviews.map((review, idx) => (
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
                  <h4 className="font-semibold text-slate-800 text-[14px]">{review.name}</h4>
                  {review.verified && (
                    <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Verified</span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-[15px] mb-1.5">{review.title}</h3>
              </div>
              <span className="text-[12px] text-slate-400 shrink-0">{review.date}</span>
            </div>
            <p className="text-slate-600 text-[14px] leading-relaxed">{review.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
