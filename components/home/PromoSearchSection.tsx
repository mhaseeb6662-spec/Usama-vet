import React from "react";
import { Search } from "lucide-react";

export default function PromoSearchSection() {
  const popularSearches = ["Cattle Care", "Poultry", "Supplements", "Pet Care", "Vitamins"];

  return (
    <section className="px-4 max-w-7xl mx-auto py-8">
      <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl p-8 md:p-12 text-center shadow-xl relative overflow-hidden">
        {/* Background graphic effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#065f46_0%,transparent_50%)] opacity-40" />
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-emerald-800/10 blur-2xl" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {/* Billingual headings (Urdu + English) matching Qadri Gadgets styling */}
          <div className="space-y-2">
            <h3 className="text-[20px] sm:text-[24px] md:text-[26px] font-bold">
              تلاش کریں اپنی پسندیدہ پروڈکٹس
            </h3>
            <p className="text-[12px] sm:text-[13px] text-emerald-200 font-normal max-w-lg mx-auto">
              Search Your Desired Veterinary Products - Sourced & Verified by Animal Health Experts.
            </p>
          </div>

          {/* Large centered search input */}
          <div className="w-full flex max-w-xl mx-auto shadow-md rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Enter medicine name, compound or brand..."
              className="w-full bg-white text-slate-800 text-[13px] px-4 py-3 focus:outline-none placeholder:text-slate-400"
              disabled
            />
            <button
              type="button"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-[13px] uppercase px-6 flex items-center gap-1.5 transition-colors cursor-not-allowed shrink-0"
              disabled
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>

          {/* Popular searches chips */}
          <div className="pt-2">
            <span className="text-[12px] text-emerald-300 font-semibold uppercase block mb-2">
              Popular Searches:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((chip) => (
                <span
                  key={chip}
                  className="bg-emerald-800/50 hover:bg-emerald-800 border border-emerald-700/60 text-emerald-100 text-[11px] sm:text-[12px] px-3 py-1.5 rounded-full cursor-not-allowed font-medium transition-colors"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
