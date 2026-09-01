"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import ReviewCard from "@/components/reviews/ReviewCard";
import type { Review } from "@/types";
import { FadeUp } from "@/components/shared/AnimationComponents";
import { useReducedMotion } from "framer-motion";

function loopedReviews(reviews: Review[]) {
  if (reviews.length === 0) return [];
  const copies = Math.max(4, Math.ceil(12 / reviews.length));
  return Array.from({ length: copies }, (_, copy) =>
    reviews.map((review) => ({
      review,
      key: `${review.id}-${copy}`,
    }))
  ).flat();
}

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const exactPositionRef = useRef(0);
  const shouldReduceMotion = useReducedMotion();
  const items = useMemo(() => loopedReviews(reviews), [reviews]);

  useEffect(() => {
    exactPositionRef.current = 0;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [reviews]);

  useEffect(() => {
    if (reviews.length === 0 || shouldReduceMotion) return;

    let animationFrameId = 0;
    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      const node = scrollRef.current;

      if (node && !isHovered) {
        exactPositionRef.current += 0.08 * deltaTime;
        const loopWidth = node.scrollWidth / 2;
        if (loopWidth > 0 && exactPositionRef.current >= loopWidth) {
          exactPositionRef.current -= loopWidth;
        }
        node.scrollLeft = exactPositionRef.current;
      }

      if (node && isHovered) {
        exactPositionRef.current = node.scrollLeft;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, reviews.length, shouldReduceMotion]);

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto overflow-hidden">
      <FadeUp distance={10}>
        <SectionHeader
          preTitle="Testimonials"
          title="WHAT OUR CLIENTS SAY"
          description="Discover how Usama Vet Care is supporting dairy farmers, livestock breeders, and pet keepers with authentic product delivery."
        />
      </FadeUp>

      {reviews.length === 0 ? (
        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-8 text-center">
          <p className="text-slate-600">No customer reviews have been published yet.</p>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="mt-8 flex items-stretch gap-6 overflow-x-auto pb-8 scrollbar-none px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {items.map(({ review, key }) => (
            <div key={key} className="shrink-0 w-[300px] sm:w-[350px] h-auto flex">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
