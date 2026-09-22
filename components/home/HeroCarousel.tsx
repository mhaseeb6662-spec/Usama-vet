"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { isPersistentPublicImage } from "@/lib/mediaUrl";

type HeroSlideImage = {
  desktopImage?: string | null;
  mobileImage?: string | null;
};

function publicImageSrc(value?: string | null) {
  const image = typeof value === "string" ? value.trim() : "";
  return isPersistentPublicImage(image) ? image : "";
}

function slideSources(slide: HeroSlideImage | undefined) {
  const desktop = publicImageSrc(slide?.desktopImage);
  const mobile = publicImageSrc(slide?.mobileImage);
  return {
    desktop: desktop || mobile,
    mobile: mobile || desktop,
  };
}

const BANNER_IMG_CLASS =
  "block w-full h-[210px] sm:h-[280px] md:h-auto w-full object-cover object-center";

export default function HeroCarousel({ slides = [] }: { slides?: HeroSlideImage[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const activeSlides = slides.filter((slide) => {
    const sources = slideSources(slide);
    return Boolean(sources.desktop || sources.mobile);
  });
  const safeIndex = activeSlides.length > 0 ? currentSlide % activeSlides.length : 0;
  const sources = slideSources(activeSlides[safeIndex]);
  const showImage = Boolean(sources.desktop || sources.mobile) && !imageFailed;

  useEffect(() => {
    setImageFailed(false);
  }, [safeIndex]);

  useEffect(() => {
    if (activeSlides.length < 2) return;
    const timer = setInterval(() => {
      if (!isTransitioning) {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length, isTransitioning]);

  const goTo = (nextIndex: number) => {
    if (isTransitioning || activeSlides.length < 2) return;
    setIsTransitioning(true);
    setCurrentSlide((nextIndex + activeSlides.length) % activeSlides.length);
    window.setTimeout(() => setIsTransitioning(false), shouldReduceMotion ? 0 : 500);
  };

  if (activeSlides.length === 0) {
    return <div className="w-full min-h-[210px] sm:min-h-[280px] bg-emerald-950 relative z-0" />;
  }

  return (
    <div className="w-full relative z-0 bg-slate-100 overflow-hidden shadow-md group">
      <AnimatePresence mode="wait">
        <motion.div
          key={safeIndex}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }}
          className="w-full"
        >
          {showImage ? (
            <picture>
              {sources.mobile && sources.mobile !== sources.desktop ? (
                <source media="(max-width: 767px)" srcSet={sources.mobile} />
              ) : null}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sources.desktop || sources.mobile}
                alt="Usama Vet homepage banner"
                className={BANNER_IMG_CLASS}
                fetchPriority="high"
                decoding="async"
                onError={() => setImageFailed(true)}
              />
            </picture>
          ) : (
            <div className="w-full h-[210px] sm:h-[280px] md:min-h-[140px] bg-emerald-950" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Animated Call to Action Button */}
      <div className="absolute inset-0 z-10 flex items-center justify-start pointer-events-none px-6 sm:px-12 md:px-20 lg:px-24 pt-20 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 100 }}
          className="pointer-events-auto"
        >
          <Link
            href="/products"
            className="group relative flex items-center justify-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3 bg-emerald-600/95 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-[0_8px_25px_rgba(0,148,115,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_30px_rgba(0,148,115,0.6)] active:scale-95 overflow-hidden border border-emerald-400/30 backdrop-blur-sm"
          >
            {/* Glossy shine overlay */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <span className="relative z-10">Shop Collections</span>
            
            <span className="relative z-10 flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </span>
          </Link>
        </motion.div>
      </div>

      {activeSlides.length > 1 ? (
        <div className="absolute bottom-3 sm:bottom-6 left-3 right-3 sm:left-8 sm:right-8 flex items-center justify-between z-20">
          <div className="flex gap-2">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                  safeIndex === idx
                    ? "w-7 bg-emerald-500 shadow-sm shadow-emerald-500/50"
                    : "w-2 bg-white/70 hover:bg-white"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => goTo(safeIndex - 1)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/35 hover:bg-black/50 backdrop-blur-sm border border-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => goTo(safeIndex + 1)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/35 hover:bg-black/50 backdrop-blur-sm border border-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
