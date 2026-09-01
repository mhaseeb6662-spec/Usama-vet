"use client";

import React, { useRef, useState, useEffect } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import ReviewCard from "@/components/reviews/ReviewCard";
import type { Review } from "@/types";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const exactPositionRef = useRef(0);
  const directionRef = useRef<1 | -1>(1); // 1 = right, -1 = left
  const isInitializedRef = useRef(false);

  // Smooth Continuous Auto-scroll logic (Ping-Pong)
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    if (!isInitializedRef.current && scrollRef.current) {
      exactPositionRef.current = scrollRef.current.scrollLeft;
      isInitializedRef.current = true;
    }

    const renderLoop = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        
        // Change direction smoothly if we hit boundaries
        if (directionRef.current === 1 && Math.ceil(exactPositionRef.current + clientWidth) >= scrollWidth - 2) {
          directionRef.current = -1; // Turn left
        } else if (directionRef.current === -1 && exactPositionRef.current <= 2) {
          directionRef.current = 1; // Turn right
        }

        // Speed mapping: 0.08 px/ms (normal), 0 px/ms (completely STOP on hover)
        const targetSpeed = isHovered ? 0 : 0.08;
        
        if (targetSpeed > 0) {
          exactPositionRef.current += (targetSpeed * deltaTime * directionRef.current);
          scrollRef.current.scrollLeft = exactPositionRef.current;
        }
        
        // If user manually swipes/scrolls, re-sync our float tracker
        if (Math.abs(scrollRef.current.scrollLeft - exactPositionRef.current) > 2) {
          exactPositionRef.current = scrollRef.current.scrollLeft;
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return (
    <section 
      className="py-12 px-4 max-w-7xl mx-auto overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Testimonials section header with reveal */}
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
        <StaggerContainer staggerDelay={0.06} className="mt-8">
          <div
            ref={scrollRef}
            className="flex items-stretch gap-6 overflow-x-auto pb-8 scrollbar-none px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reviews.map((review) => (
              <div key={review.id} className="shrink-0 w-[300px] sm:w-[350px] h-auto flex">
                <StaggerItem distance={12} className="w-full flex">
                  <ReviewCard review={review} />
                </StaggerItem>
              </div>
            ))}
          </div>
        </StaggerContainer>
      )}
    </section>
  );
}
