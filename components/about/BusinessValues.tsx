import React from "react";
import { FadeUp } from "@/components/shared/AnimationComponents";
import { ABOUT_DATA } from "@/lib/data/aboutData";

export default function BusinessValues() {
  return (
    <section className="py-12 sm:py-16 px-4 max-w-5xl mx-auto">
      <FadeUp distance={15} className="text-center mb-10">
        <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900">Our Business Principles</h2>
      </FadeUp>
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
        {ABOUT_DATA.values.map((value, idx) => (
          <FadeUp key={idx} distance={15} delay={idx * 0.05} className="flex gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
            <div>
              <h3 className="text-[15px] sm:text-[16px] font-bold text-slate-900 mb-1">{value.title}</h3>
              <p className="text-[13px] text-slate-600 leading-relaxed">{value.description}</p>
            </div>
          </FadeUp>
        ))}
      </div>
      
      <FadeUp distance={10} delay={0.2} className="mt-12 text-center">
        <p className="text-[11px] sm:text-[12px] text-slate-400 max-w-2xl mx-auto italic">
          * Product information is provided for general guidance. For diagnosis, treatment or dosage decisions, consult a qualified veterinary professional.
        </p>
      </FadeUp>
    </section>
  );
}
