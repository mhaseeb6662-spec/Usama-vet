import React from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { name, description, slug, iconName, productCount } = category;

  // Dynamically resolve icon from lucide-react
  // Fallback to "Layers" if the specific icon does not exist or fails to load
  const IconComponent = (Icons as any)[iconName] || Icons.Layers;

  return (
    <Link
      href={`/categories/${slug}`}
      className="bg-white border border-slate-200 hover:border-emerald-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start group focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      {/* Category Icon Container */}
      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
        <IconComponent className="w-6 h-6" />
      </div>

      {/* Category Info */}
      <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors text-base mb-1.5">
        {name}
      </h3>
      
      <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-grow">
        {description}
      </p>

      {/* Footer statistics */}
      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-auto">
        {productCount ? `${productCount} Products Available` : "Browse Products"}
      </div>
    </Link>
  );
}
