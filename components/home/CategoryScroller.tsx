"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MOCK_CATEGORIES } from "@/lib/data/mockData";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";

export default function CategoryScroller() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll logic for Categories
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 5) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Scroll right by approximately one category circle width (e.g., 120px)
          scrollRef.current.scrollBy({ left: 120, behavior: "smooth" });
        }
      }
    }, 1500); // 1.5 seconds interval for smooth movement

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section 
      className="py-10 px-4 max-w-7xl mx-auto overflow-hidden group/section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Small title matching screenshot */}
      <div className="text-center mb-6">
        <FadeUp distance={10}>
          <h2 className="text-lg font-bold text-slate-900 uppercase relative inline-block pb-1.5">
            Shop By Categories
            <span className="absolute bottom-0 left-1/4 w-1/2 h-0.5 bg-emerald-600 rounded-full" />
          </h2>
        </FadeUp>
      </div>

      {/* Categories Row (Circular layouts scroller with auto-scroll) */}
      <StaggerContainer staggerDelay={0.05}>
        <div 
          ref={scrollRef}
          className="flex items-start gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none justify-start snap-x snap-mandatory px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {MOCK_CATEGORIES.map((cat, index) => {
            // Using picsum.photos with a fixed seed based on category id to simulate real category images
            const imageUrl = `https://picsum.photos/seed/${cat.id}/200/200`;

            return (
              <div key={cat.id} className="shrink-0 snap-start">
                <StaggerItem distance={12}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="flex flex-col items-center group focus:outline-none w-[72px] sm:w-[90px]"
                  >
                    {/* Circular Image Container */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-50 border-2 border-slate-200 group-hover:border-emerald-500 overflow-hidden transition-all duration-200 ease-out flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:shadow-md">
                      <Image 
                        src={imageUrl} 
                        alt={cat.name} 
                        width={80} 
                        height={80} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized // Allows external images without Next.js config domains
                      />
                    </div>
                    
                    {/* Category Title */}
                    <span className="block mt-2.5 text-[11px] sm:text-[12px] font-semibold text-slate-750 group-hover:text-emerald-600 transition-colors duration-200 text-center leading-tight line-clamp-2">
                      {cat.name}
                    </span>
                  </Link>
                </StaggerItem>
              </div>
            );
          })}
        </div>
      </StaggerContainer>
    </section>
  );
}
