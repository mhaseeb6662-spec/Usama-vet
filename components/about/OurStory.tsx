import React from "react";
import Image from "next/image";
import { FadeUp } from "@/components/shared/AnimationComponents";
import { ABOUT_DATA } from "@/lib/data/aboutData";

export default function OurStory() {
  return (
    <section className="py-12 sm:py-16 px-4 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <FadeUp distance={20} className="relative h-[300px] sm:h-[400px] rounded-2xl overflow-hidden shadow-lg bg-slate-100">
          <Image 
            src={ABOUT_DATA.story.image} 
            alt="Our Business Story" 
            fill 
            className="object-cover" 
            unoptimized 
          />
        </FadeUp>
        <div className="space-y-5">
          <FadeUp distance={15}>
            <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 relative inline-block pb-2">
              {ABOUT_DATA.story.title}
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-emerald-600 rounded-full" />
            </h2>
          </FadeUp>
          <FadeUp distance={15} delay={0.1} className="space-y-4">
            {ABOUT_DATA.story.content.map((paragraph, idx) => (
              <p key={idx} className="text-[14px] sm:text-[15px] text-slate-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
