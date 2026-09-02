"use client";

import React from "react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";
import { ABOUT_DATA } from "@/lib/data/aboutData";

export default function WhyChooseUs() {
  return (
    <section className="relative py-20 sm:py-28 px-4 bg-slate-50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute -left-40 top-40 w-96 h-96 bg-emerald-200/40 rounded-full blur-[80px]" />
      <div className="absolute -right-40 bottom-10 w-96 h-96 bg-emerald-300/30 rounded-full blur-[100px]" />
      
      <div className="relative max-w-7xl mx-auto z-10">
        {/* SEO Friendly Section Header */}
        <FadeUp distance={20} className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-emerald-600 font-bold tracking-wider uppercase text-[12px] sm:text-[13px] mb-3 block drop-shadow-sm">
            The Usama Vet Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Why Trusted Farms & Clinics Choose Us
          </h2>
          <p className="text-slate-600 text-[15px] sm:text-[17px] leading-relaxed">
            We don't just sell products; we deliver peace of mind. Here is why thousands of veterinary professionals and livestock farmers across Pakistan rely on our surgical tools and medicines.
          </p>
        </FadeUp>

        {/* Semantic Article Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" staggerDelay={0.1}>
          {ABOUT_DATA.benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <StaggerItem key={idx} distance={20}>
                <article className="group relative bg-white h-full rounded-2xl p-5 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.12)] transition-all duration-500 overflow-hidden border border-slate-100 hover:border-emerald-200">
                  
                  {/* Subtle Gradient Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-transparent to-emerald-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon Container with Micro-interactions */}
                  <div className="relative mb-6">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 transition-all duration-500 shadow-sm z-10 relative">
                      <Icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-500" />
                    </div>
                    {/* Decorative Blob Behind Icon */}
                    <div className="absolute top-1/2 left-7 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-400/30 rounded-full blur-xl group-hover:w-16 group-hover:h-16 group-hover:bg-emerald-400/50 transition-all duration-500 z-0" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-600 text-[14.5px] leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                      {benefit.description}
                    </p>
                  </div>

                  {/* Animated Corner Accent Line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-emerald-500 group-hover:w-full transition-all duration-500 ease-out" />
                </article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
