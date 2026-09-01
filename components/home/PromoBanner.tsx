import React from "react";
import { FadeUp } from "@/components/shared/AnimationComponents";

interface PromoBannerProps {
  image?: string | null;
}

export default function PromoBanner({ image }: PromoBannerProps) {
  const src = typeof image === "string" ? image.trim() : "";
  if (!src) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 overflow-hidden">
      <FadeUp distance={14} duration={0.45}>
        <div className="rounded-xl overflow-hidden bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="Promotional banner"
            className="block w-full h-auto max-h-[70vh] object-contain object-center mx-auto"
          />
        </div>
      </FadeUp>
    </div>
  );
}
