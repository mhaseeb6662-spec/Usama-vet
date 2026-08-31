import React from "react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";
import { ABOUT_DATA } from "@/lib/data/aboutData";

export default function ReachSection() {
  const validStats = ABOUT_DATA.reach.stats.filter(stat => stat.value !== "CLIENT_TO_PROVIDE");

  return (
    <section className="py-12 sm:py-16 bg-emerald-950 text-white">
      <div className="px-4 max-w-7xl mx-auto text-center">
        <FadeUp distance={15}>
          <h2 className="text-2xl sm:text-[28px] font-bold mb-8">
            {ABOUT_DATA.reach.title}
          </h2>
        </FadeUp>
        
        {validStats.length > 0 ? (
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6" staggerDelay={0.1}>
            {validStats.map((stat, idx) => (
              <StaggerItem key={idx} distance={15}>
                <div className="p-4 border border-emerald-800/50 rounded-xl bg-emerald-900/30">
                  <div className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-2">{stat.value}</div>
                  <div className="text-[12px] sm:text-[13px] text-emerald-200 uppercase tracking-wider font-semibold">{stat.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <FadeUp distance={15} delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4 text-emerald-200">
              {ABOUT_DATA.reach.stats.map(stat => (
                <span key={stat.label} className="px-4 py-2 rounded-full bg-emerald-900/50 border border-emerald-800 text-[13px] sm:text-[14px]">
                  {stat.label}
                </span>
              ))}
            </div>
          </FadeUp>
        )}
      </div>
    </section>
  );
}
