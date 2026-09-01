"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { FadeUp } from "@/components/shared/AnimationComponents";
import type { AboutVideoItem } from "@/lib/data/aboutVideos";

function VideoCard({
  video,
  onPlayingChange,
}: {
  video: AboutVideoItem;
  onPlayingChange: (playing: boolean) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playVideo = () => {
    setIsPlaying(true);
    onPlayingChange(true);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
        {isPlaying ? (
          <iframe
            src={`${video.url}?autoplay=1`}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
            <button
              onClick={playVideo}
              className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors"
              aria-label={`Play ${video.title}`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-600/90 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 ml-1" fill="currentColor" />
              </div>
            </button>
          </>
        )}
      </div>
      <div className="p-4 sm:p-5 flex-grow">
        <h3 className="text-[15px] sm:text-[16px] font-bold text-slate-900 mb-1 line-clamp-1">{video.title}</h3>
        <p className="text-[13px] text-slate-500 line-clamp-2">{video.description}</p>
      </div>
    </div>
  );
}

export default function JourneyVideos({ videos = [] }: { videos?: AboutVideoItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const exactPositionRef = useRef(0);
  const isInitializedRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
  };

  useEffect(() => {
    checkScrollState();
    window.addEventListener("resize", checkScrollState);
    return () => window.removeEventListener("resize", checkScrollState);
  }, [videos]);

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

      if (scrollRef.current && videos.length > 1) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = Math.max(0, scrollWidth - clientWidth);
        const shouldPause = isHovered || isPlaying;

        if (!shouldPause && maxScroll > 2) {
          exactPositionRef.current += 0.08 * deltaTime;
          if (exactPositionRef.current >= maxScroll - 1) {
            exactPositionRef.current = 0;
          }
          scrollRef.current.scrollLeft = exactPositionRef.current;
        }

        if (Math.abs(scrollRef.current.scrollLeft - exactPositionRef.current) > 2) {
          exactPositionRef.current = scrollRef.current.scrollLeft;
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isPlaying, videos.length]);

  const scrollByAmount = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -360 : 360;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!videos || videos.length === 0) return null;

  return (
    <section
      className="py-12 sm:py-16 bg-slate-50 px-4 overflow-hidden group/section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto relative">
        <FadeUp distance={15} className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 mb-2">Our Journey in Action</h2>
          <p className="text-[14px] text-slate-600">Take a closer look at our business, products, events and day-to-day journey.</p>
        </FadeUp>

        {canScrollLeft && (
          <button
            onClick={() => scrollByAmount("left")}
            className="absolute left-0 top-[55%] -translate-y-1/2 -ml-2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-100 text-slate-700 flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 hover:text-emerald-600 hover:scale-110 active:scale-95"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {canScrollRight && videos.length > 1 && (
          <button
            onClick={() => scrollByAmount("right")}
            className="absolute right-0 top-[55%] -translate-y-1/2 -mr-2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-100 text-slate-700 flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 hover:text-emerald-600 hover:scale-110 active:scale-95"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScrollState}
          className="flex gap-6 overflow-x-auto scrollbar-none pb-6 pt-2 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {videos.map((video) => (
            <div key={video.id} className="w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0">
              <VideoCard video={video} onPlayingChange={setIsPlaying} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
