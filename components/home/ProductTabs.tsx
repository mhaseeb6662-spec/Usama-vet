"use client";

import React, { useState } from "react";
import { MOCK_PRODUCTS } from "@/lib/data/mockData";
import ProductCard from "@/components/product/ProductCard";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type TabName = "Featured Products" | "New Arrivals" | "Best Selling Products";

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState<TabName>("Featured Products");
  const shouldReduceMotion = useReducedMotion();

  // Get products based on active tab
  const getFilteredProducts = () => {
    switch (activeTab) {
      case "Featured Products":
        // First 8 items
        return MOCK_PRODUCTS.slice(0, 8);
      case "New Arrivals":
        // Middle 8 items
        return MOCK_PRODUCTS.slice(8, 16);
      case "Best Selling Products":
        // Last 8 items
        return MOCK_PRODUCTS.slice(16, 24);
      default:
        return MOCK_PRODUCTS.slice(0, 8);
    }
  };

  const tabs: TabName[] = ["Featured Products", "New Arrivals", "Best Selling Products"];

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto overflow-hidden">
      {/* Tab Controls Row */}
      <div className="flex justify-center border-b border-slate-200 mb-8 flex-wrap gap-1 sm:gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-6 py-2.5 text-xs sm:text-[13px] font-semibold uppercase relative transition-all duration-200 focus:outline-none cursor-pointer ${
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

      {/* Products Grid with content transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
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
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {getFilteredProducts().map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
