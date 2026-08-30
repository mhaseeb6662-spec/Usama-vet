import React from "react";
import { ShieldAlert, Award, Truck, BadgeCheck } from "lucide-react";

export default function LowerTrustStrip() {
  return (
    <section className="bg-slate-100/50 border-t border-b border-slate-200 py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {/* Card 1: Genuine Products */}
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-[13px] uppercase">
              Genuine Products
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-normal">
              Quality-focused product sourcing directly from licensed pharma manufacturers.
            </p>
          </div>
        </div>

        {/* Card 2: Best Prices */}
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-[13px] uppercase">
              Competitive Prices
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-normal">
              We offer wholesale-matched veterinary pricing to help farmers maximize margins.
            </p>
          </div>
        </div>

        {/* Card 3: Fast Delivery */}
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Truck className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-[13px] uppercase">
              Cold-Chain Shipping
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-normal">
              Vigilant temperature handling preserves medicine potency across long transits.
            </p>
          </div>
        </div>

        {/* Card 4: Trusted Store */}
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <BadgeCheck className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-[13px] uppercase">
              Licensed Pharmacy
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-normal">
              Regulated veterinary store compliance, ensuring drug safety standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
