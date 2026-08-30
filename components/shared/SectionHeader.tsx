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
        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">
          {preTitle}
        </span>
      )}
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
        {title}
      </h2>
      <div className="w-12 h-1 bg-emerald-600 mx-auto mt-2.5 rounded-full" />
      {description && (
        <p className="text-slate-500 text-xs mt-2.5 leading-relaxed font-light">
          {description}
        </p>
      )}
    </div>
  );
}
