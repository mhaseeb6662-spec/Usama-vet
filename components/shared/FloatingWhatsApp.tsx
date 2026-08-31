"use client";

import React from "react";
import { motion } from "framer-motion";
import { BUSINESS_CONFIG } from "@/lib/constants/config";

export default function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex items-center justify-center pointer-events-none">
      
      {/* Container to handle pointer events only for the button area */}
      <div className="relative flex items-center justify-center pointer-events-auto">
        
        {/* Animated Pulse Rings behind the button */}
        <motion.div
          className="absolute inset-0 rounded-full bg-emerald-500/40"
          animate={{
            scale: [1, 1.4, 1.8],
            opacity: [0.6, 0.2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />

        {/* 3D Floating Button */}
        <motion.a
          href={BUSINESS_CONFIG.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-[#128C7E] to-[#25D366] rounded-full shadow-[0_8px_16px_rgba(37,211,102,0.4),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-emerald-300 group focus:outline-none"
          animate={{
            y: [0, -6, 0],
            rotateZ: [0, -3, 3, 0], // Subtle 3D wobble
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{
            scale: 1.1,
            rotateZ: 0,
            boxShadow: "0 12px 24px rgba(37,211,102,0.6), inset 0 2px 4px rgba(255,255,255,0.6)",
          }}
          whileTap={{ scale: 0.9 }}
          aria-label="Chat on WhatsApp"
        >
          {/* Official WhatsApp SVG Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7 text-white drop-shadow-md group-hover:drop-shadow-lg transition-all"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.8 5.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>

          {/* Hover Tooltip - Explodes from the button */}
          <span className="absolute left-[calc(100%+16px)] bg-white text-slate-800 text-[12px] font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap pointer-events-none before:absolute before:-left-1 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-white before:rotate-45">
            Chat with us
          </span>
        </motion.a>
      </div>
    </div>
  );
}
