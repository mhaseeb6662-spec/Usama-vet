"use client";

import React, { useState, useCallback } from "react";
import { ShieldCheck } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  inStock: boolean;
}

export default function ProductImageGallery({
  images,
  productName,
  inStock,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] || "";

  // Touch and scroll state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [lastWheelTime, setLastWheelTime] = useState(0);

  const minSwipeDistance = 40;

  const handleNextPrev = useCallback((direction: number) => {
    if (images.length <= 1) return;
    setActiveIndex((prev) => {
      let newIndex = prev + direction;
      if (newIndex >= images.length) newIndex = 0;
      if (newIndex < 0) newIndex = images.length - 1;
      return newIndex;
    });
  }, [images.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextPrev(1); // Swipe left -> next image
    } else if (isRightSwipe) {
      handleNextPrev(-1); // Swipe right -> previous image
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    if (images.length <= 1) return;
    
    // Check if the scroll is mostly horizontal
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 15) {
      const now = Date.now();
      // Throttle wheel events so it doesn't fly through all images in one scroll
      if (now - lastWheelTime > 300) {
        if (e.deltaX > 0) {
          handleNextPrev(1);
        } else {
          handleNextPrev(-1);
        }
        setLastWheelTime(now);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div 
        className="aspect-square bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndHandler}
        onWheel={onWheel}
      >
        {activeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeImage}
            alt={productName}
            className="w-full h-full object-contain p-3 sm:p-6 select-none"
            draggable={false}
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center select-none">
            <ShieldCheck className="w-12 h-12" />
          </div>
        )}

        <div className="absolute top-4 left-4 pointer-events-none">
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
              inStock
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/65"
                : "bg-rose-50 text-rose-700 border border-rose-200/65"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border overflow-hidden bg-slate-50 transition-all ${
                index === activeIndex
                  ? "border-emerald-500 ring-2 ring-emerald-200"
                  : "border-slate-200 hover:border-emerald-300"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={`${productName} view ${index + 1}`} className="w-full h-full object-contain p-1" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
