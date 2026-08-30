import React from "react";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";

export default function TrustStrip() {
  return (
    <section className="px-4 max-w-7xl mx-auto py-2">
      <StaggerContainer staggerDelay={0.06} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Box 1: Fast Delivery */}
        <StaggerItem distance={10}>
          <div className="bg-emerald-50/45 border border-emerald-100/60 rounded-xl p-3 flex items-center gap-3 text-left shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 group">
            <div className="w-9 h-9 rounded-lg bg-white text-emerald-600 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-[1.05] transition-transform duration-200">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-[12px] uppercase">
                Fast Nationwide Delivery
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-normal">
                Secure cold-chain logistics for sensitive veterinary vaccines.
              </p>
            </div>
          </div>
        </StaggerItem>

        {/* Box 2: Easy Returns */}
        <StaggerItem distance={10}>
          <div className="bg-emerald-50/45 border border-emerald-100/60 rounded-xl p-3 flex items-center gap-3 text-left shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 group">
            <div className="w-9 h-9 rounded-lg bg-white text-emerald-600 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-[1.05] transition-transform duration-200">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-[12px] uppercase">
                Hassle-Free Returns
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-normal">
                Return products within 7 days in original packing.
              </p>
            </div>
          </div>
        </StaggerItem>

        {/* Box 3: Secure Payment */}
        <StaggerItem distance={10}>
          <div className="bg-emerald-50/45 border border-emerald-100/60 rounded-xl p-3 flex items-center gap-3 text-left shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 group">
            <div className="w-9 h-9 rounded-lg bg-white text-emerald-600 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-[1.05] transition-transform duration-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-[12px] uppercase">
                100% Secure Checkout
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-normal">
                Cash on delivery, bank transfer, EasyPaisa, or JazzCash.
              </p>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
}
