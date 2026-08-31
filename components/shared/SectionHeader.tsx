import React from "react";

interface SectionHeaderProps {
  preTitle?: string;
  title: string;
  description?: string;
}

export default function SectionHeader({ preTitle, title, description }: SectionHeaderProps) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-10">
      {preTitle && (
        <span className="text-[14px] font-semibold text-emerald-600 uppercase block mb-1">
          {preTitle}
        </span>
      )}
      <h2 className="text-[24px] sm:text-[28px] font-bold text-slate-900 leading-snug">
        {title}
      </h2>
      <div className="w-16 h-1 bg-emerald-600 mx-auto mt-3 rounded-full" />
      {description && (
        <p className="text-slate-500 text-[14px] sm:text-[15px] mt-3 leading-relaxed font-normal">
          {description}
        </p>
      )}
    </div>
  );
}
