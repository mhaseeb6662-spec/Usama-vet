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
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
              Genuine Products
            </h4>
            <p className="text-[10px] text-slate-500 leading-normal mt-0.5 font-light">
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
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
              Competitive Prices
            </h4>
            <p className="text-[10px] text-slate-500 leading-normal mt-0.5 font-light">
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
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
              Cold-Chain Shipping
            </h4>
            <p className="text-[10px] text-slate-500 leading-normal mt-0.5 font-light">
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
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
              Licensed Pharmacy
            </h4>
            <p className="text-[10px] text-slate-500 leading-normal mt-0.5 font-light">
              Regulated veterinary store compliance, ensuring drug safety standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
