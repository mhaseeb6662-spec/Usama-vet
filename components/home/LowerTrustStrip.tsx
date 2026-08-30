import React from "react";
import { ShieldAlert, Award, Truck, BadgeCheck } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";

export default function LowerTrustStrip() {
  return (
    <section className="bg-slate-100/50 border-t border-b border-slate-200 py-6 px-4 overflow-hidden">
      <StaggerContainer staggerDelay={0.05} className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
        {/* Card 1: Genuine Products */}
        <StaggerItem distance={8}>
          <div className="flex gap-2.5 items-start group">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-[1.05] transition-transform duration-200">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-[12px] uppercase">
                Genuine Products
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-normal">
                Quality-focused product sourcing directly from licensed pharma manufacturers.
              </p>
            </div>
          </div>
        </StaggerItem>

        {/* Card 2: Best Prices */}
        <StaggerItem distance={8}>
          <div className="flex gap-2.5 items-start group">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-[1.05] transition-transform duration-200">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-[12px] uppercase">
                Competitive Prices
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-normal">
                We offer wholesale-matched veterinary pricing to help farmers maximize margins.
              </p>
            </div>
          </div>
        </StaggerItem>

        {/* Card 3: Fast Delivery */}
        <StaggerItem distance={8}>
          <div className="flex gap-2.5 items-start group">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-[1.05] transition-transform duration-200">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-[12px] uppercase">
                Cold-Chain Shipping
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-normal">
                Vigilant temperature handling preserves medicine potency across long transits.
              </p>
            </div>
          </div>
        </StaggerItem>

        {/* Card 4: Trusted Store */}
        <StaggerItem distance={8}>
          <div className="flex gap-2.5 items-start group">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-[1.05] transition-transform duration-200">
              <BadgeCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-[12px] uppercase">
                Licensed Pharmacy
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-normal">
                Regulated veterinary store compliance, ensuring drug safety standards.
              </p>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
}
