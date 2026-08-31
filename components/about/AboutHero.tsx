import React from "react";
import Link from "next/link";
import { FadeUp } from "@/components/shared/AnimationComponents";
import { ABOUT_DATA } from "@/lib/data/aboutData";

export default function AboutHero() {
  return (
    <section className="relative bg-emerald-900 text-white py-16 sm:py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#065f46_0%,transparent_50%)] opacity-50" />
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <FadeUp distance={16}>
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-bold leading-tight">
            {ABOUT_DATA.hero.title}
          </h1>
        </FadeUp>
        <FadeUp distance={16} delay={0.1}>
          <p className="text-[14px] sm:text-[15px] text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            {ABOUT_DATA.hero.subtitle}
          </p>
        </FadeUp>
        <FadeUp distance={16} delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/#products"
              className="bg-emerald-500 hover:bg-emerald-400 text-white text-[13px] sm:text-[14px] font-semibold px-6 py-2.5 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore Products
            </Link>
            <Link
              href="/contact"
              className="bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 text-white text-[13px] sm:text-[14px] font-semibold px-6 py-2.5 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Contact Us
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
