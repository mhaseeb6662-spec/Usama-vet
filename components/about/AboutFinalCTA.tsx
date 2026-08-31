"use client";

import React from "react";
import Link from "next/link";
import { FadeUp } from "@/components/shared/AnimationComponents";
import { ABOUT_DATA } from "@/lib/data/aboutData";
import { motion } from "framer-motion";

export default function AboutFinalCTA() {
  return (
    <section className="relative w-full py-28 sm:py-40 bg-slate-900 overflow-hidden flex items-center justify-center mt-10">
      
      {/* Background Gradient & Animated Glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 z-0" />
      
      {/* Decorative Blob 1 */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] z-0 pointer-events-none"
      />
      
      {/* Decorative Blob 2 */}
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] z-0 pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center space-y-8">
        <FadeUp distance={30}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
            {ABOUT_DATA.cta.title}
          </h2>
        </FadeUp>
        
        <FadeUp distance={20} delay={0.1}>
          <p className="text-[16px] sm:text-[18px] md:text-[20px] text-emerald-100 max-w-2xl mx-auto leading-relaxed font-medium">
            {ABOUT_DATA.cta.subtitle}
          </p>
        </FadeUp>
        
        <FadeUp distance={20} delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8">
            <Link
              href="/#products"
              className="bg-emerald-500 hover:bg-emerald-400 text-white text-[15px] sm:text-[16px] font-bold px-10 py-4 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-1 active:translate-y-0"
            >
              Explore Products
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-emerald-400/50 hover:border-emerald-300 text-emerald-50 hover:bg-emerald-400/10 text-[15px] sm:text-[16px] font-bold px-10 py-4 rounded-full transition-all hover:-translate-y-1 active:translate-y-0"
            >
              Contact Us
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
