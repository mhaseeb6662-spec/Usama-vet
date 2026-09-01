"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export const TIMINGS = {
  FAST: 0.2,     // 0.18–0.22s
  NORMAL: 0.4,   // 0.35–0.45s
  SLOW: 0.6,     // 0.55–0.65s
};

export const EASING: any = [0.22, 1, 0.36, 1];

interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = TIMINGS.NORMAL, className = "" }: AnimationProps) {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: shouldReduceMotion ? 0.05 : duration,
        delay,
        ease: EASING,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeUp({ children, delay = 0, duration = TIMINGS.NORMAL, className = "", distance = 12 }: AnimationProps & { distance?: number }) {
  const shouldReduceMotion = useReducedMotion();
  const revealDistance = shouldReduceMotion ? 0 : distance;
  
  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: shouldReduceMotion ? 0.05 : duration,
        delay,
        ease: EASING,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, duration = TIMINGS.NORMAL, className = "", scale = 0.97 }: AnimationProps & { scale?: number }) {
  const shouldReduceMotion = useReducedMotion();
  const startScale = shouldReduceMotion ? 1 : scale;
  
  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: shouldReduceMotion ? 0.05 : duration,
        delay,
        ease: EASING,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
}

export function StaggerContainer({ children, className = "", staggerDelay = 0.06, delay = 0 }: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}

export function StaggerItem({ children, className = "", distance = 12 }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const revealDistance = shouldReduceMotion ? 0 : distance;
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 1, y: 0 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{
        duration: TIMINGS.NORMAL,
        ease: EASING,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
