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
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col group h-full">
      {/* 1. IMAGE CONTAINER (Clean square container, no overlays) */}
      <div className="aspect-square bg-[#fbfdfc] relative flex items-center justify-center border-b border-slate-100 overflow-hidden shrink-0">
        {/* Placeholder Graphic */}
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <ShieldCheck className="w-7 h-7" />
        </div>

        {/* Stock Status Badge (Bottom Left) */}
        {!inStock && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-rose-50 text-rose-700 border border-rose-200/50 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* 2. PRODUCT INFO AREA */}
      <div className="p-3.5 flex-grow flex flex-col text-left">
        {/* Product Title */}
        <Link href={`/products/${slug}`} className="block focus:outline-none mb-1">
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1 leading-snug hover:text-[#009473] transition-colors">
            {name}
          </h3>
        </Link>

        {/* Thin Divider Line (Separates Title from Price & Actions like screenshot) */}
        <div className="border-t border-slate-100/80 my-2" />

        {/* Price Row (Rs. format, old price crossed-out first, new price second) */}
        <div className="flex items-center gap-2 mb-3.5 text-xs">
          {oldPrice && oldPrice > price && (
            <span className="text-slate-400 line-through font-medium">
              Rs. {oldPrice.toLocaleString()}
            </span>
          )}
          <span className="font-bold text-slate-900">
            Rs. {price.toLocaleString()}
          </span>
        </div>

        {/* 3. ACTIONS ROW (Eye, Heart, Add to cart Button aligned horizontally) */}
        <div className="mt-auto flex items-center gap-2">
          {/* Compare/View Button (Circular, white background, green icon) */}
          <Link
            href={`/products/${slug}`}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-[#f0f8f5] text-[#009473] flex items-center justify-center transition-colors shrink-0 focus:outline-none"
            aria-label="View Product Details"
          >
            <Eye className="w-4 h-4" />
          </Link>

          {/* Wishlist Button (Circular, white background, green icon) */}
          <button
            onClick={() => setIsWished(!isWished)}
            className={`w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-[#f0f8f5] flex items-center justify-center transition-colors shrink-0 focus:outline-none ${
              isWished ? "text-red-500 border-red-200 bg-red-50" : "text-[#009473]"
            }`}
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWished ? "fill-current" : ""}`} />
          </button>

          {/* Add to cart Button (Pill, solid green) */}
          <button
            disabled={!inStock}
            className="flex-grow bg-[#009473] hover:bg-[#028467] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[11px] py-2 px-3 rounded-full flex items-center justify-center gap-1.5 transition-colors focus:outline-none"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
