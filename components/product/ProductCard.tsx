import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { name, brand, price, currency, slug, inStock, imageAlt } = product;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group h-full">
      {/* Product Image Area */}
      <div className="aspect-square bg-slate-50 relative flex items-center justify-center border-b border-slate-100 overflow-hidden">
        {/* Placeholder Graphic since image assets are mocked */}
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <ShieldCheck className="w-8 h-8" />
        </div>
        
        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
              inStock
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                : "bg-rose-50 text-rose-700 border border-rose-200/60"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Product Details Content */}
      <div className="p-4 flex-grow flex flex-col">
        <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1 block">
          {brand}
        </span>
        
        <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug mb-2 group-hover:text-emerald-600 transition-colors flex-grow">
          {name}
        </h3>

        {/* Price & Currency */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block leading-none">Price</span>
            <span className="font-extrabold text-slate-900 text-base">
              {currency} {price.toLocaleString()}
            </span>
          </div>
          
          <Link
            href={`/products/${slug}`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label={`View details for ${name}`}
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
