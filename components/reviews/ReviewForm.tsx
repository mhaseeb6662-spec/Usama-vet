"use client";

import React, { useState } from "react";
import { Star, UploadCloud, CheckCircle2 } from "lucide-react";

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, title, content, displayName, whatsappNumber }),
      });
      
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setRating(0);
          setTitle("");
          setContent("");
          setDisplayName("");
          setWhatsappNumber("");
        }, 5000);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to submit review");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-12">
      <div className="p-4 sm:p-8 md:p-10">
        <h2 className="text-center text-[22px] font-bold text-slate-900 mb-8">
          Write a review
        </h2>

        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Review Submitted!</h3>
            <p className="text-slate-500">Thank you for sharing your experience. It has been sent for approval.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}
            
            <div className="flex flex-col items-center justify-center space-y-2 mb-8">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 stroke-[1.5]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest ml-1">Review Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your review a title" className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400" />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest ml-1">Review Content</label>
              <textarea required value={content} onChange={(e) => setContent(e.target.value)} placeholder="Start writing here..." rows={5} className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y placeholder:text-slate-400" />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest ml-1">Review Image</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 sm:p-10 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-emerald-200 cursor-pointer transition-all group">
                <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 transition-colors mb-3" />
                <span className="text-[13px] font-medium text-slate-600 group-hover:text-emerald-600">Click to select images</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest ml-1">Display Name</label>
                <input type="text" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Ahmed" className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest ml-1">WhatsApp Number</label>
                <input type="tel" required value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="Enter number" className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400" />
              </div>
            </div>

            <div className="pt-6 text-center">
              <button disabled={isSubmitting} type="submit" className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-semibold text-[14px] px-10 py-3.5 rounded-full shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
