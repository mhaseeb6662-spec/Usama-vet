"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, Heart, ShoppingCart, ShieldCheck } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { name, price, oldPrice, slug, inStock } = product;
  const [isWished, setIsWished] = useState(false);

  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-200/80 hover:-translate-y-1 transition-all duration-200 ease-out flex flex-col group h-full">
      {/* 1. IMAGE CONTAINER (Clean square container, no overlays) */}
      <div className="aspect-square bg-[#fbfdfc] relative flex items-center justify-center border-b border-slate-100 overflow-hidden shrink-0">
        {/* Placeholder Graphic (Scales subtlely on group hover) */}
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-[1.035] transition-transform duration-300 ease-out">
          <ShieldCheck className="w-7 h-7" />
        </div>

        {/* Stock Status Badge (Bottom Left) */}
        {!inStock && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-rose-50 text-rose-700 border border-rose-200/50 text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* 2. PRODUCT INFO AREA */}
      <div className="p-3.5 flex-grow flex flex-col text-left">
        {/* Product Title (Subtle color transition) */}
        <Link href={`/products/${slug}`} className="block focus:outline-none mb-1 group/title">
          <h3 className="font-semibold text-slate-800 text-[13px] sm:text-[14px] line-clamp-2 leading-[1.35] group-hover/title:text-[#009473] transition-colors duration-150">
            {name}
          </h3>
        </Link>

        {/* Thin Divider Line (Separates Title from Price & Actions) */}
        <div className="border-t border-slate-100/80 my-2" />

        {/* Price Row (Rs. format, old price crossed-out first, new price second) */}
        <div className="flex items-center gap-2 mb-3.5 text-[13px] sm:text-[14px]">
          {oldPrice && oldPrice > price && (
            <span className="text-slate-400 line-through font-normal text-[11px] sm:text-[12px]">
              Rs. {oldPrice.toLocaleString()}
            </span>
          )}
          <span className="font-semibold text-slate-900">
            Rs. {price.toLocaleString()}
          </span>
        </div>

        {/* 3. ACTIONS ROW (Eye, Heart, Add to cart Button aligned horizontally) */}
        <div className="mt-auto flex items-center gap-2">
          {/* Compare/View Button (Circular, hover:scale 1.07, tap:scale 0.9) */}
          <Link
            href={`/products/${slug}`}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-[#f0f8f5] text-[#009473] flex items-center justify-center shrink-0 transition-all hover:scale-[1.07] active:scale-[0.9] duration-150 focus:outline-none cursor-pointer"
            aria-label="View Product Details"
          >
            <Eye className="w-4 h-4" />
          </Link>

          {/* Wishlist Button (Circular, hover:scale 1.07, tap:scale 0.9) */}
          <button
            onClick={() => setIsWished(!isWished)}
            className={`w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-[#f0f8f5] flex items-center justify-center shrink-0 transition-all hover:scale-[1.07] active:scale-[0.9] duration-150 focus:outline-none cursor-pointer ${
              isWished ? "text-red-500 border-red-200 bg-red-50" : "text-[#009473]"
            }`}
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWished ? "fill-current" : ""}`} />
          </button>

          {/* Add to cart Button (Pill, hover scale 1.015 + translate-y, tap scale 0.96) */}
          <button
            disabled={!inStock}
            className="flex-grow bg-[#009473] hover:bg-[#028467] hover:scale-[1.015] hover:-translate-y-[1px] active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:transition-none text-white font-semibold text-[11px] sm:text-[12px] py-2 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all duration-150 focus:outline-none cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
