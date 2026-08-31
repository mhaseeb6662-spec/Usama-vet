"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";
import { ABOUT_DATA } from "@/lib/data/aboutData";

function VideoCard({ video }: { video: typeof ABOUT_DATA.videos[0] }) {
  const [isPlaying, setIsPlaying] = useState(false);

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
              onClick={() => setIsPlaying(true)}
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

export default function JourneyVideos() {
  if (!ABOUT_DATA.videos || ABOUT_DATA.videos.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-slate-50 px-4">
      <div className="max-w-7xl mx-auto">
        <FadeUp distance={15} className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 mb-2">Our Journey in Action</h2>
          <p className="text-[14px] text-slate-600">Take a closer look at our business, products, events and day-to-day journey.</p>
        </FadeUp>
        
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
          {ABOUT_DATA.videos.map((video) => (
            <StaggerItem key={video.id} distance={15}>
              <VideoCard video={video} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
