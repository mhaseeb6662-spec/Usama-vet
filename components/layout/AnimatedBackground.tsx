"use client";

import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-slate-50">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/bg-texture-1.jpg')" }}
      />
      <div className="absolute inset-0 bg-white/90" />
    </div>
  );
}
