"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MOCK_CATEGORIES } from "@/lib/data/mockData";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";

export default function CategoryScroller() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const exactPositionRef = useRef(0);
  const directionRef = useRef<1 | -1>(1); // 1 = right, -1 = left
  const isInitializedRef = useRef(false);

  // Smooth Continuous Auto-scroll logic (Ping-Pong)
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    // Sync initial exact position with DOM
    if (!isInitializedRef.current && scrollRef.current) {
      exactPositionRef.current = scrollRef.current.scrollLeft;
      isInitializedRef.current = true;
    }

    const renderLoop = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        
        // Change direction smoothly if we hit the boundaries
        if (directionRef.current === 1 && Math.ceil(exactPositionRef.current + clientWidth) >= scrollWidth - 2) {
          directionRef.current = -1; // Turn left
        } else if (directionRef.current === -1 && exactPositionRef.current <= 2) {
          directionRef.current = 1; // Turn right
        }

        // Speed mapping: 0.08 px/ms (normal), 0 px/ms (completely STOP on hover)
        const targetSpeed = isHovered ? 0 : 0.08;
        
        // Increment exact float position (only if not stopped)
        if (targetSpeed > 0) {
          exactPositionRef.current += (targetSpeed * deltaTime * directionRef.current);
          
          // Apply to DOM
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
      className="py-5 px-4 max-w-7xl mx-auto overflow-hidden group/section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Small title matching screenshot */}
      <div className="text-center mb-4">
        <FadeUp distance={10}>
          <h2 className="text-[17px] font-bold text-slate-900 uppercase relative inline-block pb-1.5">
            Shop By Categories
            <span className="absolute bottom-0 left-1/4 w-1/2 h-0.5 bg-emerald-600 rounded-full" />
          </h2>
        </FadeUp>
      </div>

      {/* Categories Row (Circular layouts scroller with auto-scroll) */}
      <StaggerContainer staggerDelay={0.05}>
        <div 
          ref={scrollRef}
          className="flex items-start gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-none justify-start px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Duplicating the categories array to ensure it overflows the screen for the marquee effect */}
          {[...MOCK_CATEGORIES, ...MOCK_CATEGORIES, ...MOCK_CATEGORIES].map((cat, index) => {
            // Using picsum.photos with a fixed seed based on category id to simulate real category images
            const imageUrl = `https://picsum.photos/seed/${cat.id}/200/200`;

            return (
              <div key={`${cat.id}-${index}`} className="shrink-0">
                <StaggerItem distance={12}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="flex flex-col items-center group focus:outline-none w-[64px] sm:w-[76px]"
                  >
                    {/* Circular Image Container */}
                    <div className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full bg-slate-50 border-2 border-slate-200 group-hover:border-emerald-500 overflow-hidden transition-all duration-200 ease-out flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:shadow-md">
                      <Image 
                        src={imageUrl} 
                        alt={cat.name} 
                        width={80} 
                        height={80} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized // Allows external images without Next.js config domains
                      />
                    </div>
                    
                    {/* Category Title */}
                    <span className="block mt-2 text-[10px] sm:text-[11px] font-semibold text-slate-750 group-hover:text-emerald-600 transition-colors duration-200 text-center leading-tight line-clamp-2">
                      {cat.name}
                    </span>
                  </Link>
                </StaggerItem>
              </div>
            );
          })}
        </div>
      </StaggerContainer>
    </section>
  );
}
