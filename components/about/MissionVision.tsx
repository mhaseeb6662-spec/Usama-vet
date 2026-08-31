"use client";

import React, { useRef, MouseEvent } from "react";
import { ABOUT_DATA } from "@/lib/data/aboutData";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";

function Tilt3DCard({ data, index }: { data: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Motion values to track mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for smooth 3D tilting
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  // Map mouse values (-0.5 to 0.5) to rotation degrees (max 12 deg)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  // Map mouse values for the dynamic glare effect
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = data.icon;

  return (
    <StaggerItem distance={30}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative group w-full h-full rounded-3xl cursor-pointer"
      >
        {/* Soft Animated Shadow behind the card */}
        <div className="absolute inset-0 bg-emerald-600/10 blur-2xl rounded-3xl transform translate-y-6 -z-10 group-hover:bg-emerald-500/20 group-hover:blur-3xl transition-all duration-500" />
        
        {/* Main Card Container */}
        <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl p-8 md:p-12 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)] group-hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] transition-shadow duration-500 transform-gpu">
          
          {/* Dynamic Glare Overlay */}
          <motion.div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
            style={{ background: glareBackground }}
          />

          {/* Decorative Background Blob */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-500 z-0" />

          {/* Floating Content (Parallax Effect via translateZ) */}
          <div 
            style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }} 
            className="relative z-10 flex flex-col h-full"
          >
            {/* Glowing Icon */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-emerald-400/20 shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] group-hover:bg-emerald-500/20 transition-all duration-500">
              <Icon className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
            </div>
            
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
              {data.title}
            </h3>
            
            <p className="text-slate-300 text-[15px] md:text-[17px] leading-relaxed">
              {data.content}
            </p>
          </div>
        </div>
      </motion.div>
    </StaggerItem>
  );
}

export default function MissionVision() {
  const missionVisionEntries = Object.entries(ABOUT_DATA.missionVision);

  return (
    <section className="py-16 sm:py-24 px-4 bg-slate-50 overflow-hidden perspective-[1000px]">
      <div className="max-w-6xl mx-auto">
        <StaggerContainer className="grid md:grid-cols-2 gap-10 sm:gap-14" staggerDelay={0.1}>
          {missionVisionEntries.map(([key, data], index) => (
            <Tilt3DCard key={key} data={data} index={index} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
