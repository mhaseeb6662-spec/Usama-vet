"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Stethoscope, ShieldCheck, Heart } from "lucide-react";

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

  // Auto scroll slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-xl overflow-hidden shadow-lg h-64 sm:h-80 md:h-[350px] flex items-center">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-15" />
        
        {/* Slides rendering */}
        {HERO_SLIDES.map((slide, index) => {
          const ActiveIcon = slide.badgeIcon;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out px-8 sm:px-14 flex items-center ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Slide text details (Left-aligned) */}
              <div className="max-w-xl space-y-3 sm:space-y-4 text-left">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 uppercase tracking-wider">
                  <ActiveIcon className="w-3 h-3" /> {slide.tag}
                </span>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                  {slide.title}
                </h2>
                
                <p className="text-slate-350 text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
                  {slide.description}
                </p>
                
                <div className="pt-2">
                  <Link
                    href={slide.link}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 sm:py-3 rounded-lg shadow-md hover:shadow-emerald-600/10 transition-all focus:outline-none"
                  >
                    {slide.btnText}
                  </Link>
                </div>
              </div>

              {/* Graphic Placeholder (Right-aligned) */}
              <div className="hidden md:flex flex-grow justify-end max-w-sm ml-auto opacity-30 lg:opacity-75">
                <div className="w-48 h-48 rounded-full border border-emerald-500/10 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-pulse" />
                  <div className="w-36 h-36 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ActiveIcon className="w-16 h-16" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Slide Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-3.5 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all focus:outline-none"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3.5 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all focus:outline-none"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Pagination Indicator Dots */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-20">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all focus:outline-none ${
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
