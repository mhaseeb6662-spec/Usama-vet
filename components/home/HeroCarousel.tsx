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
  const [imageFailed, setImageFailed] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;

  useEffect(() => {
    setImageFailed(false);
  }, [currentSlide]);

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
  const imageSrc = slide.desktopImage || "";
  const showImage = Boolean(imageSrc) && !imageFailed;
  
  const iconList = [Stethoscope, ShieldCheck, Heart];
  const ActiveIcon = slide.badgeIcon || iconList[currentSlide % iconList.length];

  return (
    <div className="w-full relative bg-emerald-950 overflow-hidden shadow-md h-[220px] sm:h-[280px] md:h-[340px] flex items-center justify-center group">
      
      {/* Absolute Background Patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {showImage ? (
            <Link href={slide.ctaUrl || slide.link || "#products"} className="block w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={imageSrc} 
                alt={slide.title || "Banner"} 
                className="w-full h-full object-cover" 
                onError={() => setImageFailed(true)}
              />
            </Link>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm relative z-10">
              <ActiveIcon className="w-16 h-16 text-emerald-400 mb-4 opacity-50" />
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{slide.title}</h2>
              <p className="text-slate-300 max-w-lg">{slide.description}</p>
            </div>
          )}
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
