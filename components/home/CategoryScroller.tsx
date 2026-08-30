"use client";

import React from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { MOCK_CATEGORIES } from "@/lib/data/mockData";

export default function CategoryScroller() {
  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      {/* Small title matching screenshot */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-slate-900 uppercase relative inline-block pb-1.5">
          Shop By Categories
          <span className="absolute bottom-0 left-1/4 w-1/2 h-0.5 bg-emerald-600 rounded-full" />
        </h2>
      </div>

      {/* Categories Row (Circular layouts scroller) */}
      <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent justify-start md:justify-center">
        {MOCK_CATEGORIES.map((cat) => {
          // Resolve icon dynamically
          const IconComponent = (Icons as any)[cat.iconName] || Icons.Layers;

          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="flex flex-col items-center shrink-0 group focus:outline-none"
            >
              {/* Circular Border & Container */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-650 hover:text-emerald-700 transition-all duration-300 flex items-center justify-center shadow-sm group-hover:scale-105">
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              
              {/* Category Title */}
              <span className="block mt-2.5 text-[12px] sm:text-[13px] font-semibold text-slate-750 group-hover:text-emerald-600 transition-colors text-center max-w-[100px] leading-tight">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
