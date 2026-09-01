"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, Heart, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import AddToCartButton from "@/components/cart/AddToCartButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { name, price, oldPrice, slug, inStock } = product;
  const [isWished, setIsWished] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const imageSrc = product.images && product.images.length > 0 ? product.images[0] : "";
  const showImage = Boolean(imageSrc) && !imageFailed;

  // Auto-calculate discount percentage if a valid discount exists
  const hasDiscount = oldPrice && oldPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-200/80 hover:-translate-y-1 transition-all duration-200 ease-out flex flex-col group h-full">
      {/* 1. IMAGE CONTAINER (Clean square container, no overlays) */}
      <div className="aspect-square bg-[#fbfdfc] relative flex items-center justify-center border-b border-slate-100 overflow-hidden shrink-0 p-4">
        {showImage ? (
          <img 
            src={imageSrc} 
            alt={product.imageAlt || product.name} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-[1.035] transition-transform duration-300 ease-out">
            <ShieldCheck className="w-7 h-7" />
          </div>
        )}

        {/* Discount Badge (Top Right) */}
        {hasDiscount && discountPercent > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-2 right-2 z-10 bg-rose-500 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm transition-transform duration-200 group-hover:-translate-y-[1px] group-hover:scale-105 pointer-events-none"
          >
            {discountPercent}% OFF
          </motion.div>
        )}

        {/* Stock Status Badge (Bottom Left) */}
        {!inStock && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="bg-rose-50 text-rose-700 border border-rose-200/50 text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* 2. PRODUCT INFO AREA */}
      <div className="p-4 flex-grow flex flex-col text-left">
        {/* Product Title (Subtle color transition) */}
        <Link href={`/products/${slug}`} className="block focus:outline-none mb-2 group/title">
          <h3 className="font-semibold text-slate-800 text-[15px] sm:text-[16px] line-clamp-2 leading-snug group-hover/title:text-[#009473] transition-colors duration-150">
            {name}
          </h3>
        </Link>

        {/* Thin Divider Line (Separates Title from Price & Actions) */}
        <div className="border-t border-slate-100/80 my-2.5" />

        {/* Price Row (Rs. format, old price crossed-out first, new price second) */}
        <div className="flex items-center gap-2 mb-4 text-[15px] sm:text-[16px]">
          {oldPrice && oldPrice > price && (
            <span className="text-slate-400 line-through font-normal text-[12px] sm:text-[13px]">
              Rs. {oldPrice.toLocaleString()}
            </span>
          )}
          <span className="font-semibold text-slate-900">
            Rs. {price.toLocaleString()}
          </span>
        </div>

        {/* 3. ACTIONS ROW (Eye, Heart, Add to cart Button aligned horizontally) */}
        <div className="mt-auto flex items-center gap-2">
          {/* Compare/View Button */}
          <Link
            href={`/products/${slug}`}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-[#f0f8f5] text-[#009473] flex items-center justify-center shrink-0 transition-all hover:scale-[1.07] active:scale-[0.9] duration-150 focus:outline-none cursor-pointer shadow-sm"
            aria-label="View Product Details"
          >
            <Eye className="w-5 h-5" />
          </Link>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWished(!isWished)}
            className={`w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-[#f0f8f5] flex items-center justify-center shrink-0 transition-all hover:scale-[1.07] active:scale-[0.9] duration-150 focus:outline-none cursor-pointer shadow-sm ${
              isWished ? "text-red-500 border-red-200 bg-red-50" : "text-[#009473]"
            }`}
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-5 h-5 ${isWished ? "fill-current" : ""}`} />
          </button>

          <AddToCartButton
            productId={Number.parseInt(product.id, 10)}
            inStock={inStock}
            stockCount={product.stockCount}
          />
        </div>
      </div>
    </div>
  );
}
