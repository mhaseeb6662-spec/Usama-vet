"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const TEXTURES = [
  '/bg-texture-1.jpg',
  '/bg-texture-2.jpg',
  '/bg-texture-3.jpg',
];

export default function AnimatedBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Change background smoothly every 7 seconds
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TEXTURES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-slate-50">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={TEXTURES[currentIndex]}
            alt="Nature Background"
            fill
            quality={60}
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Professional Overlay: Makes text readable by blending white with a stronger opacity */}
      <div className="absolute inset-0 bg-white/90" />
    </div>
  );
}
