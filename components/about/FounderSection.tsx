import React from "react";
import Image from "next/image";
import { FadeUp } from "@/components/shared/AnimationComponents";
import { ABOUT_DATA } from "@/lib/data/aboutData";

export default function FounderSection() {
  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-y border-slate-200/60">
      <div className="px-4 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <FadeUp distance={20} className="w-48 h-48 sm:w-64 sm:h-64 shrink-0 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-200">
            <Image 
              src={ABOUT_DATA.founder.image} 
              alt={`Founder of Usama Vet`} 
              width={300} 
              height={300} 
              className="object-cover w-full h-full"
              unoptimized
            />
          </FadeUp>
          <div className="text-center md:text-left space-y-4">
            <FadeUp distance={15}>
              <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900">Meet the Founder</h2>
              <p className="text-[13px] sm:text-[14px] text-emerald-700 font-semibold uppercase tracking-wider mt-1">
                {ABOUT_DATA.founder.name} &bull; {ABOUT_DATA.founder.designation}
              </p>
            </FadeUp>
            <FadeUp distance={15} delay={0.1}>
              <p className="text-[15px] sm:text-[17px] text-slate-700 italic leading-relaxed border-l-4 border-emerald-500 pl-4 bg-white/50 py-2 rounded-r-lg">
                &ldquo;{ABOUT_DATA.founder.message}&rdquo;
              </p>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
