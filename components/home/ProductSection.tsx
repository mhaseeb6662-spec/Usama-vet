"use client";

import React, { useRef, useState, useEffect } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import ProductCard from "@/components/product/ProductCard";
import ViewAllButton from "@/components/shared/ViewAllButton";
import { Product } from "@/types";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductSectionProps {
  preTitle?: string;
  title: string;
  description?: string;
  products: Product[];
  bgColorClass?: string;
  viewAllHref: string;
  viewAllLabel?: string;
}

export default function ProductSection({
  preTitle,
  title,
  description,
  products,
  bgColorClass = "bg-white",
  viewAllHref,
  viewAllLabel,
}: ProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScrollState();
    window.addEventListener("resize", checkScrollState);
    return () => window.removeEventListener("resize", checkScrollState);
  }, [products]);

  const scrollByAmount = (direction: "left" | "right") => {
    if (scrollRef.current) {
      // Find the width of one card + gap (assuming 24px gap = 1.5rem, roughly 280px total)
      // Or just scroll by roughly the container width
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className={`py-16 px-4 border-t border-b border-slate-100 ${bgColorClass} overflow-hidden group/section`}>
      <div className="max-w-7xl mx-auto relative">
        <FadeUp distance={10}>
          <SectionHeader preTitle={preTitle} title={title} description={description} />
        </FadeUp>
        
        {/* Slider Controls */}
        {canScrollLeft && (
          <button
            onClick={() => scrollByAmount("left")}
            className="absolute left-0 top-[55%] -translate-y-1/2 -ml-3 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-100 text-slate-700 flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 hover:text-emerald-600 hover:scale-110 active:scale-95"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {canScrollRight && products.length > 4 && (
          <button
            onClick={() => scrollByAmount("right")}
            className="absolute right-0 top-[55%] -translate-y-1/2 -mr-3 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-100 text-slate-700 flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 hover:text-emerald-600 hover:scale-110 active:scale-95"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Product Slider Track */}
        <StaggerContainer staggerDelay={0.04}>
          <div
            ref={scrollRef}
            onScroll={checkScrollState}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 pt-2 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div key={product.id} className="w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] shrink-0 snap-start">
                <StaggerItem distance={14} className="h-full">
                  <ProductCard product={product} />
                </StaggerItem>
              </div>
            ))}
          </div>
        </StaggerContainer>

        <ViewAllButton href={viewAllHref} label={viewAllLabel} />
      </div>
    </section>
  );
}
