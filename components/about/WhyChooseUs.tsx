import React from "react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";
import { ABOUT_DATA } from "@/lib/data/aboutData";

export default function WhyChooseUs() {
  return (
    <section className="py-12 sm:py-16 px-4 max-w-7xl mx-auto">
      <FadeUp distance={15} className="text-center mb-10">
        <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900">Why Customers Choose Us</h2>
      </FadeUp>
      <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.05}>
        {ABOUT_DATA.benefits.map((benefit, idx) => {
          const Icon = benefit.icon;
          return (
            <StaggerItem key={idx} distance={10}>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 h-full flex flex-col items-center text-center hover:bg-white hover:shadow-md hover:border-emerald-100 transition-all">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] sm:text-[16px] font-bold text-slate-800 mb-2">{benefit.title}</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed">{benefit.description}</p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
