"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Stethoscope, ShieldCheck, Heart } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const HERO_SLIDES = [
  {
    tag: "Direct Pharmacy & Supplies",
    title: "Trusted Veterinary & Animal Care Products",
    description: "Sourcing and delivering authentic medicines, vaccines, and supplements directly from GMP certified laboratories to your farm door.",
    btnText: "Shop Medicines",
    link: "#products",
    badgeIcon: Stethoscope,
  },
  {
    tag: "Livestock Yield Boosters",
    title: "Premium Dairy Feed Supplements",
    description: "Improve rumen digestibilities, dry matter intakes, and milk fat percentages in dairy cattle using our specialized mineral premixes.",
    btnText: "Shop Supplements",
    link: "#products",
    badgeIcon: ShieldCheck,
  },
  {
    tag: "Pet Care & Hygiene Specials",
    title: "Genuine Pet Care & Parasiticides",
    description: "Keep companion pets free from ticks and fleas. Browse top-tier shampoos, tick sprays, and nutritional skin oils.",
    btnText: "Shop Pet Care",
    link: "#products",
    badgeIcon: Heart,
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Auto scroll slides (5-6 seconds delay)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioning) {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      }
    }, 5500);
    return () => clearInterval(timer);
  }, [isTransitioning]);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const slide = HERO_SLIDES[currentSlide];
  const ActiveIcon = slide.badgeIcon;

  return (
    <div className="max-w-7xl mx-auto px-4 mt-3">
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-xl overflow-hidden shadow-lg h-56 sm:h-72 md:h-[320px] flex items-center">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-15" />
        
        {/* Slides rendering with AnimatePresence */}
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -12 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 px-8 sm:px-14 flex items-center z-10 w-full"
          >
            {/* Slide text details (Left-aligned) */}
            <div className="max-w-xl space-y-3 sm:space-y-4 text-left">
              {/* Eyebrow */}
              <motion.span 
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[12px] font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 uppercase"
              >
                <ActiveIcon className="w-3 h-3" /> {slide.tag}
              </motion.span>
              
              {/* Heading */}
              <motion.h2 
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="text-[22px] sm:text-[26px] md:text-[34px] font-bold text-white leading-[1.2]"
              >
                {slide.title}
              </motion.h2>
              
              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="text-slate-350 text-[12px] sm:text-[13px] font-normal leading-normal line-clamp-3"
              >
                {slide.description}
              </motion.p>
              
              {/* CTA Button */}
              <motion.div 
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                className="pt-2"
              >
                <Link
                  href={slide.link}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] sm:text-[12px] uppercase px-5 py-2.5 rounded-md shadow-md hover:shadow-emerald-600/10 transition-all focus:outline-none hover-scale-button inline-flex items-center"
                >
                  {slide.btnText}
                </Link>
              </motion.div>
            </div>

            {/* Graphic Placeholder (Right-aligned with scale reveal) */}
            <motion.div 
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.025 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:flex flex-grow justify-end max-w-sm ml-auto opacity-30 lg:opacity-75"
            >
              <div className="w-48 h-48 rounded-full border border-emerald-500/10 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-pulse" />
                <div className="w-36 h-36 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ActiveIcon className="w-16 h-16" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Slide Arrows (Subtle scale/active animations) */}
        <button
          onClick={handlePrev}
          className="absolute left-3.5 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white focus:outline-none transition-all hover:scale-[1.07] active:scale-[0.93] duration-150 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3.5 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white focus:outline-none transition-all hover:scale-[1.07] active:scale-[0.93] duration-150 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Pagination Indicator Dots (Slide Transition) */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-20">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (isTransitioning) return;
                setIsTransitioning(true);
                setCurrentSlide(index);
                setTimeout(() => setIsTransitioning(false), 600);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                index === currentSlide ? "bg-emerald-500 w-5" : "bg-white/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
