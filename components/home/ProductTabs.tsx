"use client";

import React, { useState } from "react";
import { MOCK_PRODUCTS } from "@/lib/data/mockData";
import ProductCard from "@/components/product/ProductCard";

type TabName = "Featured Products" | "New Arrivals" | "Best Selling Products";

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState<TabName>("Featured Products");

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
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {/* Tab Controls Row */}
      <div className="flex justify-center border-b border-slate-200 mb-8 flex-wrap gap-1 sm:gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-6 py-2.5 text-xs sm:text-[13px] font-semibold uppercase transition-all focus:outline-none ${
              activeTab === tab
                ? "border-b-2 border-emerald-600 text-emerald-600 bg-slate-50"
                : "text-slate-500 hover:text-[#009473] hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {getFilteredProducts().map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
