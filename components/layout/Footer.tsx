"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { motion, useReducedMotion } from "framer-motion";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail("");
    }, 1200);
  };

  const currentYear = new Date().getFullYear();
  const revealDistance = shouldReduceMotion ? 0 : 12;

  const columnVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as any
      }
    }
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={{
        hidden: { opacity: 0, y: revealDistance },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1] as any,
            staggerChildren: shouldReduceMotion ? 0 : 0.05
          }
        }
      }}
      className="bg-[#eef8f4] text-slate-800 border-t border-slate-200/80 text-xs"
    >
      
      {/* 4-COLUMN SCREENSHOT-ALIGNED GRID */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Column 1: Logo & Business Intro */}
        <motion.div variants={columnVariants} className="space-y-4 text-left">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#009473] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
              U
            </div>
            <div>
              <span className="block font-bold text-slate-900 leading-none text-[15px] uppercase">
                {BUSINESS_CONFIG.shortName}
              </span>
              <span className="block text-[9px] text-slate-450 font-medium uppercase mt-0.5">
                Veterinary Pharmacy
              </span>
            </div>
          </div>
          <p className="text-[12px] leading-relaxed text-slate-500 font-normal">
            We specialize in providing high-quality veterinary medicines, livestock feeds, and pet care products at unbeatable prices. Our goal is to deliver animal health and wellness.
          </p>
        </motion.div>

        {/* Column 2: QUICK LINKS */}
        <motion.div variants={columnVariants} className="space-y-3.5 text-left md:pl-8">
          <h4 className="text-slate-950 font-semibold text-[13px] uppercase">
            QUICK LINKS
          </h4>
          <ul className="space-y-2.5 text-[12px] font-medium text-slate-600">
            <li>
              <Link href="/" className="hover:text-[#009473] hover:translate-x-[2px] transition-all duration-200 inline-block">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#009473] hover:translate-x-[2px] transition-all duration-200 inline-block">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-[#009473] hover:translate-x-[2px] transition-all duration-200 inline-block">
                Account
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#009473] hover:translate-x-[2px] transition-all duration-200 inline-block">
                Contact Us
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Column 3: OUR STORES */}
        <motion.div variants={columnVariants} className="space-y-3.5 text-left md:pl-8">
          <h4 className="text-slate-950 font-semibold text-[13px] uppercase">
            OUR STORES
          </h4>
          <ul className="space-y-2.5 text-[12px] font-medium text-slate-600">
            <li>
              <span className="hover:text-[#009473] hover:translate-x-[2px] cursor-not-allowed transition-all duration-200 inline-block">
                Terms & Conditions
              </span>
            </li>
            <li>
              <span className="hover:text-[#009473] hover:translate-x-[2px] cursor-not-allowed transition-all duration-200 inline-block">
                Privacy Policy
              </span>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#009473] hover:translate-x-[2px] transition-all duration-200 inline-block">
                Support
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Column 4: SIGN UP TO NEWSLETTERS */}
        <motion.div variants={columnVariants} className="space-y-4 text-left">
          <h4 className="text-slate-950 font-semibold text-[13px] uppercase">
            SIGN UP TO NEWSLETTERS
          </h4>
          
          {subscribed ? (
            <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 text-[11px] px-3 py-2.5 rounded-full text-center font-semibold">
              Subscribed successfully!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center bg-white border border-slate-250 rounded-full pl-4 pr-1 py-1 w-full shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-600 transition-all duration-200">
              <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent text-xs text-slate-850 outline-none placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#009473] hover:bg-[#028467] text-white font-semibold text-[11px] px-4 py-2 rounded-full transition-colors shrink-0 disabled:opacity-50 active:scale-95 duration-150"
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </form>
          )}

          {/* Social Icons row (Square buttons with hover-scale) */}
          <div className="space-y-2 pt-1">
            <span className="block text-[12px] font-semibold text-slate-800">
              Follow Us:
            </span>
            <div className="flex gap-2">
              {/* Facebook Box */}
              <a
                href={BUSINESS_CONFIG.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-white border border-slate-200 hover:border-[#009473] text-slate-800 hover:text-[#009473] flex items-center justify-center shadow-sm transition-all hover:scale-[1.08] active:scale-[0.93] duration-150 focus:outline-none"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* Instagram Box */}
              <a
                href={BUSINESS_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-white border border-slate-200 hover:border-[#009473] text-slate-800 hover:text-[#009473] flex items-center justify-center shadow-sm transition-all hover:scale-[1.08] active:scale-[0.93] duration-150 focus:outline-none"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.008 3.74.052 1.455.067 2.25.3 2.77.5.69.27 1.18.59 1.7 1.1.51.52.83 1.01 1.1 1.7.2.52.43 1.316.5 2.77.045.955.052 1.31.052 3.74 0 2.43-.008 2.784-.052 3.74-.067 1.455-.3 2.25-.5 2.77-.27.69-.59 1.18-1.1 1.7-.52.51-1.01.83-1.7 1.1-.52.2-1.316.43-2.77.5-.955.045-1.31.052-3.74.052-2.43 0-2.784-.008-3.74-.052-1.455-.067-2.25-.3-2.77-.5-.69-.27-1.18-.59-1.7-1.1-.51-.52-.83-1.01-1.1-1.7-.2-.52-.43-1.316-.5-2.77-.045-.955-.052-1.31-.052-3.74 0-2.43.008-2.784.052-3.74.067-1.455.3-2.25.5-2.77.27-.69.59-1.18 1.1-1.7.52-.51 1.01-.83 1.7-1.1.52-.2 1.316-.43 2.77-.5.955-.045 1.31-.052 3.74-.052zm.5 1.977c-2.408 0-2.714.01-3.66.053-.94.043-1.448.2-1.8.34-.467.18-.8.4-1.15.75-.35.35-.57.683-.75 1.15-.14.353-.3.86-.34 1.8-.043.947-.053 1.253-.053 3.66 0 2.407.01 2.714.053 3.66.043.94.2 1.448.34 1.8.18.467.4.8.75 1.15.35.35.683.57 1.15.75.353.14.86.3 1.8.34.947.043 1.253.053 3.66.053 2.407 0 2.714-.01 3.66-.053.94-.043 1.448-.2 1.8-.34.467-.18.8-.4 1.15-.75.35-.35.57-.683.75-1.15.14-.353.3-.86.34-1.8.043-.947.053-1.253.053-3.66 0-2.407-.01-2.714-.053-3.66-.043-.94-.2-1.448-.34-1.8-.18-.467-.4-.8-.75-1.15-.35-.35-.683-.57-1.15-.75-.353-.14-.86-.3-1.8-.34-.947-.043-1.253-.053-3.66-.053zm0 3.333a4.69 4.69 0 100 9.38 4.69 4.69 0 000-9.38zm0 7.403a2.713 2.713 0 110-5.426 2.713 2.713 0 010 5.426zm5.27-7.902a1.08 1.08 0 11-2.16 0 1.08 1.08 0 012.16 0z" clipRule="evenodd" />
                </svg>
              </a>

              {/* TikTok Box */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-white border border-slate-200 hover:border-[#009473] text-slate-800 hover:text-[#009473] flex items-center justify-center shadow-sm transition-all hover:scale-[1.08] active:scale-[0.93] duration-150 focus:outline-none"
                aria-label="TikTok"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.525.02c1.31.03 2.5.52 3.47 1.39a8.66 8.66 0 0 0 .54-.53c.12-.13.3-.23.49-.24H20.4c.05.77.29 1.5.7 2.13.5.78 1.2 1.39 2.03 1.77.28.12.59.2.9.22v3.42c-.44-.06-.87-.21-1.27-.43a6.83 6.83 0 0 1-2.48-2.31v8.83c0 2.2-.76 4.12-2.28 5.61C16.8 21.6 14.86 22 12.5 22c-2.32 0-4.3-.77-5.83-2.29C5.16 18.2 4.4 16.27 4.4 14.07c0-2.32.76-4.3 2.27-5.83 1.48-1.49 3.4-2.24 5.73-2.24.11 0 .22 0 .32.01v3.47c-.1-.01-.2-.02-.32-.02-1.3 0-2.36.42-3.17 1.24a4.4 4.4 0 0 0-1.23 3.17c0 1.27.42 2.33 1.23 3.15a4.4 4.4 0 0 0 3.17 1.23c1.3 0 2.37-.42 3.18-1.23.82-.82 1.24-1.88 1.24-3.15V0h-3.77z"/>
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* SOLID GREEN BOTTOM BAR */}
      <div className="bg-[#009473] py-4 px-4 border-t border-slate-200/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-white text-[11px] font-semibold">
          <div className="text-center sm:text-left select-none font-medium">
            {currentYear} &copy; usamavet.com All Rights Reserved
          </div>
          
          {/* Powered by credentials */}
          <div className="text-center sm:text-right select-none font-semibold">
            Powered By: <span className="font-bold text-emerald-100">mim-art</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
