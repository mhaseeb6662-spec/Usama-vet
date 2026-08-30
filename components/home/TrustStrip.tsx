import React from "react";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

export default function TrustStrip() {
  return (
    <section className="px-4 max-w-7xl mx-auto py-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Box 1: Fast Delivery */}
        <div className="bg-emerald-50/45 border border-emerald-100/60 rounded-xl p-4 flex items-center gap-4 text-left hover:shadow-sm transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-white text-emerald-600 flex items-center justify-center shadow-sm shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-[13px] uppercase">
              Fast Nationwide Delivery
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-normal">
              Secure cold-chain logistics for sensitive veterinary vaccines and medicines.
            </p>
          </div>
        </div>

        {/* Box 2: Easy Returns */}
        <div className="bg-emerald-50/45 border border-emerald-100/60 rounded-xl p-4 flex items-center gap-4 text-left hover:shadow-sm transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-white text-emerald-600 flex items-center justify-center shadow-sm shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-[13px] uppercase">
              Hassle-Free Returns
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-normal">
              Return products within 7 days in original packing (subject to guidelines).
            </p>
          </div>
        </div>

        {/* Box 3: Secure Payment */}
        <div className="bg-emerald-50/45 border border-emerald-100/60 rounded-xl p-4 flex items-center gap-4 text-left hover:shadow-sm transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-white text-emerald-600 flex items-center justify-center shadow-sm shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-[13px] uppercase">
              100% Secure Checkout
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-normal">
              Cash on delivery, bank transfer, EasyPaisa, or JazzCash for safe checkout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
