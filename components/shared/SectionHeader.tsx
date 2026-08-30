import React from "react";

interface SectionHeaderProps {
  preTitle?: string;
  title: string;
  description?: string;
}

export default function SectionHeader({ preTitle, title, description }: SectionHeaderProps) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-8">
      {preTitle && (
        <span className="text-[12px] font-semibold text-emerald-600 uppercase block mb-1">
          {preTitle}
        </span>
      )}
      <h2 className="text-[17px] sm:text-[20px] font-bold text-slate-900 leading-snug">
        {title}
      </h2>
      <div className="w-12 h-1 bg-emerald-600 mx-auto mt-2.5 rounded-full" />
      {description && (
        <p className="text-slate-500 text-[12px] sm:text-[13px] mt-2.5 leading-normal font-normal">
          {description}
        </p>
      )}
    </div>
  );
}
