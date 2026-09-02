import React from "react";
import { FadeUp } from "@/components/shared/AnimationComponents";
import { isPersistentPublicImage } from "@/lib/mediaUrl";

interface PromoBannerProps {
  image?: string | null;
  mobileImage?: string | null;
}

function publicImageSrc(value?: string | null) {
  const image = typeof value === "string" ? value.trim() : "";
  return isPersistentPublicImage(image) ? image : "";
}

export default function PromoBanner({ image, mobileImage }: PromoBannerProps) {
  const desktop = publicImageSrc(image);
  const mobile = publicImageSrc(mobileImage) || desktop;
  const src = desktop || mobile;
  if (!src) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 overflow-hidden">
      <FadeUp distance={14} duration={0.45}>
        <div className="rounded-xl overflow-hidden bg-slate-100">
          <picture>
            {mobile && mobile !== desktop ? (
              <source media="(max-width: 767px)" srcSet={mobile} />
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="Promotional banner"
              className="block w-full h-[160px] sm:h-[220px] md:h-auto md:max-h-[70vh] object-cover object-center md:object-contain"
            />
          </picture>
        </div>
      </FadeUp>
    </div>
  );
}
