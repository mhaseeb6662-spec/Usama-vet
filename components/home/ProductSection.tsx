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
  const [isPaused, setIsPaused] = useState(false);

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

  const exactPositionRef = useRef(0);
  const directionRef = useRef<1 | -1>(1);
  const isInitializedRef = useRef(false);

  // Smooth Continuous Auto-scroll logic (Marquee Ping-Pong)
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    if (!isInitializedRef.current && scrollRef.current) {
      exactPositionRef.current = scrollRef.current.scrollLeft;
      isInitializedRef.current = true;
    }

    const renderLoop = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = Math.max(0, scrollWidth - clientWidth);

        if (maxScroll > 5 && !isPaused) {
          if (directionRef.current === 1 && exactPositionRef.current >= maxScroll - 1) {
            directionRef.current = -1;
          } else if (directionRef.current === -1 && exactPositionRef.current <= 1) {
            directionRef.current = 1;
          }

          // Very smooth slow continuous scroll
          exactPositionRef.current += 0.05 * deltaTime * directionRef.current;
          
          // Clamp values just in case
          if (exactPositionRef.current < 0) exactPositionRef.current = 0;
          if (exactPositionRef.current > maxScroll) exactPositionRef.current = maxScroll;
          
          scrollRef.current.scrollLeft = exactPositionRef.current;
        }

        // Keep internal exact position in sync if user manually scrolled
        if (isPaused || Math.abs(scrollRef.current.scrollLeft - exactPositionRef.current) > 2) {
          exactPositionRef.current = scrollRef.current.scrollLeft;
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, products]);

  const scrollByAmount = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      directionRef.current = direction === "left" ? -1 : 1;
    }
  };

  return (
    <section 
      className={`py-8 sm:py-16 px-3 sm:px-4 border-t border-b border-slate-100 ${bgColorClass} overflow-hidden group/section`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto relative">
        <FadeUp distance={10}>
          <SectionHeader preTitle={preTitle} title={title} description={description} />
        </FadeUp>
        
        {/* Slider Controls */}
        {canScrollLeft && (
          <button
            onClick={() => scrollByAmount("left")}
            className="absolute left-0 top-[55%] -translate-y-1/2 -ml-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-100 text-slate-700 flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 hover:text-emerald-600 hover:scale-110 active:scale-95"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {canScrollRight && products.length > 4 && (
          <button
            onClick={() => scrollByAmount("right")}
            className="absolute right-0 top-[55%] -translate-y-1/2 -mr-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-100 text-slate-700 flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 hover:text-emerald-600 hover:scale-110 active:scale-95"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Product Slider Track (Removed snap properties to allow continuous scrolling) */}
        <StaggerContainer staggerDelay={0.04}>
          <div
            ref={scrollRef}
            onScroll={checkScrollState}
            className="flex gap-6 overflow-x-auto scrollbar-none pb-6 pt-2 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div key={product.id} className="w-[72vw] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] shrink-0">
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
