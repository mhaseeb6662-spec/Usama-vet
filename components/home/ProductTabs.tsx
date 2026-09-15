"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type TabName = "Featured Products" | "New Arrivals" | "Best Selling Products";

interface ProductTabsProps {
  featuredProducts?: any[];
  newArrivals?: any[];
  bestSellers?: any[];
}

export default function ProductTabs({ 
  featuredProducts = [], 
  newArrivals = [], 
  bestSellers = [] 
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabName>("Featured Products");
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const exactPositionRef = React.useRef(0);
  const directionRef = React.useRef<1 | -1>(1);
  const shouldReduceMotion = useReducedMotion();

  // Get products based on active tab
  const getFilteredProducts = () => {
    switch (activeTab) {
      case "Featured Products":
        return featuredProducts;
      case "New Arrivals":
        return newArrivals;
      case "Best Selling Products":
        return bestSellers;
      default:
        return featuredProducts;
    }
  };

  const tabs: TabName[] = ["Featured Products", "New Arrivals", "Best Selling Products"];
  const currentProducts = getFilteredProducts();

  // Smooth Continuous Auto-scroll logic (Marquee Ping-Pong)
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let isInitialized = false;

    // Reset scroll when tab changes
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
      exactPositionRef.current = 0;
      directionRef.current = 1;
      isInitialized = true;
    }

    const renderLoop = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      if (scrollRef.current) {
        if (!isInitialized) {
          exactPositionRef.current = scrollRef.current.scrollLeft;
          isInitialized = true;
        }

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
          
          if (exactPositionRef.current < 0) exactPositionRef.current = 0;
          if (exactPositionRef.current > maxScroll) exactPositionRef.current = maxScroll;
          
          scrollRef.current.scrollLeft = exactPositionRef.current;
        }

        if (isPaused || Math.abs(scrollRef.current.scrollLeft - exactPositionRef.current) > 2) {
          exactPositionRef.current = scrollRef.current.scrollLeft;
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, activeTab, currentProducts]);

  return (
    <section 
      className="py-8 sm:py-12 px-3 sm:px-4 max-w-7xl mx-auto overflow-hidden group/tabs"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Tab Controls Row */}
      <div className="flex justify-start sm:justify-center border-b border-slate-200 mb-6 sm:mb-8 gap-1 sm:gap-2 overflow-x-auto scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-3 sm:px-6 py-2.5 text-[11px] sm:text-[13px] font-semibold uppercase relative transition-all duration-200 focus:outline-none cursor-pointer ${
              activeTab === tab
                ? "text-emerald-600 bg-slate-50/50"
                : "text-slate-500 hover:text-[#009473] hover:bg-slate-50"
            }`}
          >
            <span className="relative z-10">{tab}</span>
            {activeTab === tab && !shouldReduceMotion && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {activeTab === tab && shouldReduceMotion && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 z-10" />
            )}
          </button>
        ))}
      </div>

      {/* Products Slider with content transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          ref={scrollRef}
          initial={{ opacity: 1, y: 0 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } 
          }}
          exit={{ 
            opacity: 0, 
            y: shouldReduceMotion ? 0 : 4,
            transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-6 pt-2 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.id} className="w-[72vw] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] shrink-0">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="w-full py-12 text-center text-slate-500">
              No products found in this category.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
