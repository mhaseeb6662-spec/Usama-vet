"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";

export default function CategoryScroller({ categories = [] }: { categories?: any[] }) {
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
      className="py-10 px-4 max-w-7xl mx-auto overflow-hidden group/section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Small title matching screenshot */}
      <div className="text-center mb-6">
        <FadeUp distance={10}>
          <h2 className="text-[22px] font-bold text-slate-900 uppercase relative inline-block pb-1.5">
            Shop By Categories
            <span className="absolute bottom-0 left-1/4 w-1/2 h-0.5 bg-emerald-600 rounded-full" />
          </h2>
        </FadeUp>
      </div>

      {/* Categories Row (Circular layouts scroller with auto-scroll) */}
      <StaggerContainer staggerDelay={0.05}>
        <div 
          ref={scrollRef}
          className="flex items-start gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-none justify-start px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Categories Array (No duplication as per user request) */}
          {categories.map((cat, index) => {
            const imageUrl = cat.image || "https://placehold.co/200x200/10b981/ffffff?text=Cat";

            return (
              <div key={`${cat.id}-${index}`} className="shrink-0">
                <StaggerItem distance={12}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="flex flex-col items-center group focus:outline-none w-[84px] sm:w-[110px]"
                  >
                    {/* Circular Image Container */}
                    <div className="w-20 h-20 sm:w-[96px] sm:h-[96px] rounded-full bg-slate-50 border-2 border-slate-200 group-hover:border-emerald-500 overflow-hidden transition-all duration-200 ease-out flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:shadow-md">
                      <Image 
                        src={imageUrl} 
                        alt={cat.name} 
                        width={120} 
                        height={120} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized // Allows external images without Next.js config domains
                      />
                    </div>
                    
                    {/* Category Title */}
                    <span className="block mt-3 text-[13px] sm:text-[14px] font-semibold text-slate-750 group-hover:text-emerald-600 transition-colors duration-200 text-center leading-tight line-clamp-2">
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
