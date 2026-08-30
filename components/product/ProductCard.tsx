"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, RefreshCw, ShoppingCart, Star, ShieldCheck } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { name, brand, price, oldPrice, currency, slug, inStock } = product;
  const [isWished, setIsWished] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  // Calculate discount percentage if old price exists
  const discountPercent = oldPrice && oldPrice > price
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col group relative h-full">
      {/* IMAGE CONTAINER */}
      <div className="aspect-square bg-slate-50 relative flex items-center justify-center border-b border-slate-100 overflow-hidden shrink-0">
        
        {/* Placeholder Graphic since image assets are mocked */}
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <ShieldCheck className="w-7 h-7" />
        </div>
        
        {/* Discount Badge (Top Left) */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide shadow-sm">
              -{discountPercent}% OFF
            </span>
          </div>
        )}

        {/* Wishlist & Compare Overlay Buttons (Top Right) */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => { e.preventDefault(); setIsWished(!isWished); }}
            className={`w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center transition-colors focus:outline-none ${
              isWished ? "text-red-500 border-red-200 bg-red-50" : "text-slate-500 hover:text-red-500"
            }`}
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWished ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); setIsCompared(!isCompared); }}
            className={`w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center transition-colors focus:outline-none ${
              isCompared ? "text-emerald-600 border-emerald-250 bg-emerald-50" : "text-slate-500 hover:text-emerald-600"
            }`}
            aria-label="Add to Compare"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Stock Status Badge (Bottom Left) */}
        <div className="absolute bottom-2 left-2">
          <span
            className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
              inStock
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                : "bg-rose-50 text-rose-700 border border-rose-200/50"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* DETAIL CONTENT */}
      <div className="p-3 flex-grow flex flex-col text-left">
        
        {/* Brand label */}
        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
          {brand}
        </span>
        
        {/* Product Title */}
        <Link href={`/products/${slug}`} className="block focus:outline-none">
          <h3 className="font-bold text-slate-800 text-xs line-clamp-2 leading-snug mb-1.5 hover:text-emerald-600 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating Stars (Small stars matching screenshot card layout) */}
        <div className="flex items-center gap-0.5 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-[9px] text-slate-450 font-medium ml-1">(5.0)</span>
        </div>

        {/* Pricing Area */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex flex-wrap items-baseline gap-1.5 mb-2.5">
          <span className="font-black text-slate-900 text-sm">
            {currency} {price.toLocaleString()}
          </span>
          {oldPrice && oldPrice > price && (
            <span className="text-[10px] text-slate-400 line-through">
              {currency} {oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Solid Green Add To Cart Button (Full-width like screenshot) */}
        <button
          disabled={!inStock}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[10px] uppercase tracking-wider py-2 rounded flex items-center justify-center gap-1.5 shadow-sm transition-colors focus:outline-none"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add To Cart</span>
        </button>
      </div>
    </div>
  );
}
