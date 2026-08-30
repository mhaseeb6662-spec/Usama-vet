import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface PromoBannerProps {
  title: string;
  subTitle?: string;
  badgeText?: string;
  bgClass?: string; // e.g. bg-gradient-to-r from-yellow-400 to-orange-500
  textClass?: string; // e.g. text-slate-900, text-white
  btnText?: string;
  href: string;
}

export default function PromoBanner({
  title,
  subTitle,
  badgeText = "Special Offer",
  bgClass = "bg-gradient-to-r from-emerald-600 to-teal-800",
  textClass = "text-white",
  btnText = "Shop Now",
  href,
}: PromoBannerProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className={`relative rounded-xl overflow-hidden shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left ${bgClass} ${textClass}`}>
        {/* Background mesh effects */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1 bg-white/20 border border-white/15 px-2 py-0.5 rounded text-[9px] uppercase font-black tracking-widest leading-none">
            <Sparkles className="w-3 h-3 fill-current" /> {badgeText}
          </span>
          <h3 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight leading-snug">
            {title}
          </h3>
          {subTitle && (
            <p className="text-[11px] sm:text-xs opacity-90 font-light max-w-lg leading-relaxed">
              {subTitle}
            </p>
          )}
        </div>

        <div className="relative z-10 shrink-0">
          <Link
            href={href}
            className="bg-white hover:bg-slate-50 text-slate-900 hover:text-emerald-700 font-bold text-xs uppercase tracking-wider px-5 py-2.5 sm:py-3 rounded-lg shadow-md transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <span>{btnText}</span>
            <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
