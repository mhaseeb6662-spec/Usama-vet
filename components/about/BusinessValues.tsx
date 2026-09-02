"use client";

import React from "react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";
import { ABOUT_DATA } from "@/lib/data/aboutData";

export default function BusinessValues() {
  return (
    <section className="relative py-20 sm:py-28 px-4 bg-white overflow-hidden">
      {/* Decorative Diagonal Background */}
      <div className="absolute top-0 right-0 w-full sm:w-1/2 h-full bg-emerald-50/40 -skew-x-12 transform origin-top z-0" />
      
      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Section Header */}
        <FadeUp distance={20} className="text-center mb-16 sm:mb-20">
          <span className="text-emerald-600 font-bold tracking-wider uppercase text-[12px] sm:text-[13px] mb-3 block">
            Our Core Values
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Business Principles
          </h2>
        </FadeUp>

        {/* Values Grid */}
        <StaggerContainer className="grid md:grid-cols-2 gap-6 sm:gap-10" staggerDelay={0.1}>
          {ABOUT_DATA.values.map((value, idx) => {
            return (
              <StaggerItem key={idx} distance={30}>
                <article className="group relative bg-white border border-slate-100 rounded-3xl p-5 sm:p-10 hover:bg-slate-900 transition-all duration-500 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.2)] flex flex-col sm:flex-row gap-6 items-start">
                  
                  {/* Large Decorative Number inside Card */}
                  <div className="absolute -right-6 -bottom-10 text-[130px] font-black text-slate-50 group-hover:text-white/5 transition-colors duration-500 pointer-events-none select-none z-0 leading-none">
                    0{idx + 1}
                  </div>
                  
                  {/* Glowing Number Badge */}
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 z-10 relative shadow-sm border border-emerald-100 group-hover:border-emerald-400">
                    <span className="font-bold text-lg font-mono">0{idx + 1}</span>
                    <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-500" />
                  </div>
                  
                  {/* Content Area */}
                  <div className="relative z-10 pt-1">
                    <h3 className="text-[19px] sm:text-xl font-bold text-slate-900 mb-3 group-hover:text-white transition-colors duration-500">
                      {value.title}
                    </h3>
                    <p className="text-slate-600 text-[14.5px] leading-relaxed group-hover:text-slate-300 transition-colors duration-500">
                      {value.description}
                    </p>
                  </div>

                  {/* Top Glowing Accent Line */}
                  <div className="absolute top-0 left-0 w-0 h-1.5 bg-emerald-500 group-hover:w-full transition-all duration-700 ease-in-out" />
                </article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
        
        {/* SEO & User Friendly Medical Disclaimer */}
        <FadeUp distance={10} delay={0.4} className="mt-16 sm:mt-20 text-center px-4">
          <div className="inline-block px-6 sm:px-8 py-4 sm:py-5 bg-amber-50/50 border border-amber-100 rounded-2xl shadow-sm">
            <p className="text-[12px] sm:text-[13.5px] text-amber-700/80 max-w-3xl mx-auto italic font-medium">
              * Product information is provided for general guidance. For diagnosis, treatment or dosage decisions, always consult a qualified veterinary professional.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
