import React from "react";
import Link from "next/link";
import { FadeUp } from "@/components/shared/AnimationComponents";
import { ABOUT_DATA } from "@/lib/data/aboutData";

export default function AboutFinalCTA() {
  return (
    <section className="py-16 px-4 max-w-5xl mx-auto mb-10">
      <FadeUp distance={20}>
        <div className="bg-emerald-600 text-white rounded-2xl p-8 sm:p-12 text-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          <div className="relative z-10 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold">{ABOUT_DATA.cta.title}</h2>
            <p className="text-[14px] sm:text-[15px] text-emerald-100 max-w-lg mx-auto">{ABOUT_DATA.cta.subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/#products"
                className="bg-white text-emerald-700 text-[13px] sm:text-[14px] font-semibold px-8 py-3 rounded-full shadow hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Explore Products
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border border-white text-white hover:bg-white/10 text-[13px] sm:text-[14px] font-semibold px-8 py-3 rounded-full transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
