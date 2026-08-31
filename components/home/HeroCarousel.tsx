"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Stethoscope, ShieldCheck, Heart } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const DEFAULT_SLIDES = [
  {
    subtitle: "Direct Pharmacy & Supplies",
    title: "Trusted Veterinary & Animal Care Products",
    description: "Sourcing and delivering authentic medicines, vaccines, and supplements directly from GMP certified laboratories to your farm door.",
    ctaText: "Shop Medicines",
    ctaUrl: "#products",
    badgeIcon: Stethoscope,
    desktopImage: null
  },
  {
    subtitle: "Livestock Yield Boosters",
    title: "Premium Dairy Feed Supplements",
    description: "Improve rumen digestibilities, dry matter intakes, and milk fat percentages in dairy cattle using our specialized mineral premixes.",
    ctaText: "Shop Supplements",
    ctaUrl: "#products",
    badgeIcon: ShieldCheck,
    desktopImage: null
  },
  {
    subtitle: "Pet Care & Hygiene Specials",
    title: "Genuine Pet Care & Parasiticides",
    description: "Keep companion pets free from ticks and fleas. Browse top-tier shampoos, tick sprays, and nutritional skin oils.",
    ctaText: "Shop Pet Care",
    ctaUrl: "#products",
    badgeIcon: Heart,
    desktopImage: null
  },
];

export default function HeroCarousel({ slides = [] }: { slides?: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;

  // Auto scroll slides (5-6 seconds delay)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioning) {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length, isTransitioning]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    setTimeout(() => setIsTransitioning(false), 500); // Debounce matching transition time
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const slide = activeSlides[currentSlide];
  
  // Choose an icon based on index if it doesn't have one
  const iconList = [Stethoscope, ShieldCheck, Heart];
  const ActiveIcon = slide.badgeIcon || iconList[currentSlide % iconList.length];

  return (
    <div className="w-full relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl min-h-[500px] md:min-h-[550px] lg:min-h-[600px] flex items-center justify-center">
      
      {/* Absolute Background Patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute right-0 top-0 w-3/4 h-full bg-emerald-900/20 blur-[100px] rounded-full" />
        <div className="absolute -left-20 -bottom-20 w-[40vw] h-[40vw] bg-teal-800/20 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute inset-0 flex flex-col md:flex-row items-center justify-between p-8 md:p-16"
        >
          {/* Left Content */}
          <div className="w-full md:w-1/2 space-y-5 z-10 relative">
            
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 shadow-sm"
            >
              <ActiveIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-[13px] font-semibold tracking-wider text-emerald-50 uppercase">
                {slide.subtitle || slide.tag || "Featured"}
              </span>
            </motion.div>
            
            {/* Heading */}
            <motion.h2 
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="text-[32px] sm:text-[40px] md:text-[46px] font-bold text-white leading-[1.15]"
            >
              {slide.title}
            </motion.h2>
            
            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-[15px] sm:text-[17px] font-normal leading-relaxed max-w-lg text-slate-300"
            >
              {slide.description}
            </motion.p>
            
            {/* CTA Button */}
            <motion.div 
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="pt-3"
            >
              <Link
                href={slide.ctaUrl || slide.link || "#products"}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[14px] uppercase px-8 py-3.5 rounded-lg shadow-lg hover:shadow-emerald-600/20 transition-all focus:outline-none hover-scale-button inline-flex items-center tracking-wide"
              >
                {slide.ctaText || slide.btnText || "Shop Now"}
              </Link>
            </motion.div>
          </div>

          {/* Graphic Placeholder or Image */}
          <motion.div 
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.025 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`hidden md:flex flex-grow justify-end max-w-sm ml-auto ${!slide.desktopImage ? 'opacity-30 lg:opacity-75' : ''}`}
          >
            {slide.desktopImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slide.desktopImage} alt={slide.title} className="w-full h-auto max-h-[400px] object-contain drop-shadow-2xl rounded-2xl" />
            ) : (
              <div className="w-72 h-72 lg:w-96 lg:h-96 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay"></div>
                <ActiveIcon className="w-24 h-24 lg:w-32 lg:h-32 text-white/30" />
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators & Navigation */}
      <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between z-20">
        {/* Progress Dots */}
        <div className="flex gap-2.5">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (isTransitioning) return;
                setIsTransitioning(true);
                setCurrentSlide(idx);
                setTimeout(() => setIsTransitioning(false), 500);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                currentSlide === idx 
                  ? "w-8 bg-emerald-500 shadow-sm shadow-emerald-500/50" 
                  : "w-2.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next/Prev Controls */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
