import React from "react";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";
import { ABOUT_DATA } from "@/lib/data/aboutData";

export default function MissionVision() {
  return (
    <section className="py-12 sm:py-16 px-4 max-w-5xl mx-auto">
      <StaggerContainer className="grid sm:grid-cols-2 gap-6" staggerDelay={0.1}>
        {Object.entries(ABOUT_DATA.missionVision).map(([key, data]) => {
          const Icon = data.icon;
          return (
            <StaggerItem key={key} distance={15}>
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 h-full shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-[18px] sm:text-[20px] font-bold text-slate-900 mb-3">{data.title}</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed">{data.content}</p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
