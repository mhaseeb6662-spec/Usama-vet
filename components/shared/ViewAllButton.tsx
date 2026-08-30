import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ViewAllButtonProps {
  href: string;
  label?: string;
}

export default function ViewAllButton({ href, label = "View All Products" }: ViewAllButtonProps) {
  return (
    <div className="text-center mt-8">
      <Link
        href={href}
        className="inline-flex items-center justify-center gap-1.5 border border-slate-300 hover:border-emerald-600 bg-white text-slate-700 hover:text-emerald-700 font-semibold text-xs uppercase px-6 py-2.5 rounded-lg shadow-sm transition-all active:scale-[0.97] duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 group cursor-pointer"
      >
        <span>{label}</span>
        <ArrowUpRight className="w-4 h-4 text-emerald-600 shrink-0 transition-transform duration-200 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
      </Link>
    </div>
  );
}
