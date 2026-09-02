"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";

const popularSearches = ["Cattle Care", "Poultry", "Supplements", "Pet Care", "Vitamins"];

export default function PromoSearchSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const goSearch = (term: string) => {
    const next = term.trim();
    if (next.length < 2) {
      setError("Enter at least 2 characters to search.");
      return;
    }
    setError("");
    router.push(`/search?q=${encodeURIComponent(next)}`);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    goSearch(query);
  };

  return (
    <section className="px-3 sm:px-4 max-w-7xl mx-auto py-6 sm:py-10 overflow-hidden">
      <FadeUp distance={16}>
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-xl p-5 sm:p-8 py-10 sm:py-20 md:py-32 text-center shadow-xl relative overflow-hidden flex flex-col items-center justify-center min-h-0 md:min-h-[60vh]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#065f46_0%,transparent_50%)] opacity-40" />
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-emerald-800/10 blur-2xl" />

          <StaggerContainer staggerDelay={0.06} className="relative z-10 w-full max-w-3xl mx-auto space-y-8">
            <StaggerItem distance={8}>
              <div className="space-y-3">
                <h3 className="text-[26px] sm:text-[32px] md:text-[40px] font-bold" dir="rtl">
                  تلاش کریں اپنی مطلوبہ ویٹرنری پروڈکٹس
                </h3>
                <p className="text-[13px] sm:text-[15px] text-emerald-200 font-normal max-w-xl mx-auto">
                  Search Your Desired Veterinary Products - Sourced & Verified by Animal Health Experts.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem distance={8}>
              <form action="/search" method="get" onSubmit={onSubmit} className="w-full max-w-2xl mx-auto">
                <div className="w-full flex shadow-xl rounded-lg overflow-hidden border border-emerald-700/30 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all duration-200 h-12 sm:h-16">
                  <input
                    type="search"
                    name="q"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter medicine name, compound or brand..."
                    aria-label="Search products"
                    className="w-full min-w-0 bg-white text-slate-800 text-base sm:text-[15px] px-3 sm:px-5 py-3 focus:outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[13px] sm:text-[15px] uppercase px-4 sm:px-8 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.97] duration-150 shrink-0"
                  >
                    <Search className="w-5 h-5" />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>
                {error ? <p className="mt-2 text-sm text-amber-200">{error}</p> : null}
              </form>
            </StaggerItem>

            <StaggerItem distance={8}>
              <div className="pt-2">
                <span className="text-[13px] text-emerald-300 font-semibold uppercase block mb-3">
                  Popular Searches:
                </span>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {popularSearches.map((chip) => (
                    <Link
                      key={chip}
                      href={`/search?q=${encodeURIComponent(chip)}`}
                      className="bg-emerald-800/50 hover:bg-emerald-800 border border-emerald-700/60 text-emerald-100 text-[12px] sm:text-[13px] px-4 py-2 rounded-full font-medium transition-all hover:scale-[1.02] duration-150"
                    >
                      {chip}
                    </Link>
                  ))}
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </FadeUp>
    </section>
  );
}
