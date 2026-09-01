"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type HeroSlideImage = {
  desktopImage?: string | null;
};

function slideImageSrc(slide: HeroSlideImage | undefined) {
  const image = typeof slide?.desktopImage === "string" ? slide.desktopImage.trim() : "";
  if (
    image.startsWith("/images/") ||
    image.startsWith("/api/images/") ||
    image.startsWith("https://")
  ) {
    return image;
  }
  return "";
}

export default function HeroCarousel({ slides = [] }: { slides?: HeroSlideImage[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const activeSlides = slides.filter((slide) => slideImageSrc(slide));
  const safeIndex = activeSlides.length > 0 ? currentSlide % activeSlides.length : 0;
  const imageSrc = slideImageSrc(activeSlides[safeIndex]);
  const showImage = Boolean(imageSrc) && !imageFailed;

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
    return <div className="w-full h-[220px] sm:h-[280px] md:h-[340px] bg-emerald-950" />;
  }

  return (
    <div className="w-full relative bg-emerald-950 overflow-hidden shadow-md h-[220px] sm:h-[280px] md:h-[340px] flex items-center justify-center group">
      <AnimatePresence mode="wait">
        <motion.div
          key={safeIndex}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt="Usama Vet homepage banner"
              className="w-full h-full object-cover"
              fetchPriority="high"
              decoding="async"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="w-full h-full bg-emerald-950" />
          )}
        </motion.div>
      </AnimatePresence>

      {activeSlides.length > 1 ? (
        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between z-20">
          <div className="flex gap-2.5">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                  safeIndex === idx
                    ? "w-8 bg-emerald-500 shadow-sm shadow-emerald-500/50"
                    : "w-2.5 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => goTo(safeIndex - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => goTo(safeIndex + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
