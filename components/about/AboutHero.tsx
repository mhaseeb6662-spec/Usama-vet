"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    title: "USAMA VET & SURGICAL",
    subtitle: "Complete Veterinary & Surgical Equipment at Wholesale Rates. We also offer specialized Laser Printing services for farm tags.",
    image: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=2070&auto=format&fit=crop", // Vet/Cow background
    ctaText: "Shop Equipment",
    ctaLink: "/#products",
  },
  {
    id: 2,
    title: "Premium Livestock Care",
    subtitle: "Dedicated health solutions for Cattle, Buffalo, Goats, Sheep, and Horses. Authentic medicines delivered nationwide.",
    image: "https://images.unsplash.com/photo-1574765383921-2e2193b216be?q=80&w=2070&auto=format&fit=crop", // Farm/Cattle
    ctaText: "Explore Medicines",
    ctaLink: "/categories/veterinary-medicines",
  },
  {
    id: 3,
    title: "Surgical Instruments",
    subtitle: "High-grade surgical tools, syringes, and modern farm handling equipment sourced directly from trusted manufacturers.",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2068&auto=format&fit=crop", // Vet Clinic / Dog / Tools
    ctaText: "View Instruments",
    ctaLink: "/categories/surgical-instruments",
  }
];

export default function AboutHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play logic
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(timer);
  }, [isHovered]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <section 
      className="relative w-full h-[450px] sm:h-[500px] md:h-[550px] bg-slate-900 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <Image 
            src={SLIDES[currentIndex].image} 
            alt={SLIDES[currentIndex].title}
            fill
            className="object-cover opacity-60"
            unoptimized
            priority
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-transparent" />
          
          {/* Content Area */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-2xl space-y-4 sm:space-y-6"
              >
                <div className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm rounded-full text-emerald-300 text-[10px] sm:text-[12px] font-bold uppercase tracking-wider mb-2">
                  Usama Vet & Surgical
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-md">
                  {SLIDES[currentIndex].title}
                </h1>
                <p className="text-[14px] sm:text-[16px] md:text-[18px] text-emerald-50 leading-relaxed font-medium drop-shadow max-w-xl">
                  {SLIDES[currentIndex].subtitle}
                </p>
                <div className="pt-4 flex gap-4">
                  <Link
                    href={SLIDES[currentIndex].ctaLink}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-[13px] sm:text-[15px] shadow-[0_0_15px_rgba(5,150,105,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(5,150,105,0.6)] flex items-center gap-2"
                  >
                    {SLIDES[currentIndex].ctaText}
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows (Show on Hover/Always on Mobile) */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/30 hover:bg-emerald-600 backdrop-blur-md border border-white/10 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/30 hover:bg-emerald-600 backdrop-blur-md border border-white/10 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-20">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex 
                ? "w-8 sm:w-10 h-2 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" 
                : "w-2 h-2 bg-white/40 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
