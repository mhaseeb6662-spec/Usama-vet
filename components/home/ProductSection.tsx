import React from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import ProductCard from "@/components/product/ProductCard";
import ViewAllButton from "@/components/shared/ViewAllButton";
import { Product } from "@/types";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";

interface ProductSectionProps {
  preTitle?: string;
  title: string;
  description?: string;
  products: Product[];
  bgColorClass?: string; // e.g. bg-white, bg-emerald-50/20, bg-cyan-50/20
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
  return (
    <section className={`py-16 px-4 border-t border-b border-slate-100 ${bgColorClass} overflow-hidden`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header with reveal */}
        <FadeUp distance={10}>
          <SectionHeader preTitle={preTitle} title={title} description={description} />
        </FadeUp>
        
        {/* 4-Column Product Grid with stagger reveals */}
        <StaggerContainer staggerDelay={0.04} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <StaggerItem key={product.id} distance={14}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View All Button */}
        <ViewAllButton href={viewAllHref} label={viewAllLabel} />
      </div>
    </section>
  );
}
