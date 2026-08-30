"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-350 border-t border-slate-800 text-xs">
      {/* 5-COLUMN CORE FOOTER GRID */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        
        {/* Column 1: Branding & Intro */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-black text-lg shadow">
              U
            </div>
            <div>
              <span className="block font-black text-white leading-none text-base">
                {BUSINESS_CONFIG.name}
              </span>
              <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                {BUSINESS_CONFIG.logo.subtitle}
              </span>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            {BUSINESS_CONFIG.description}
          </p>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-slate-400">{BUSINESS_CONFIG.contact.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-slate-400">Helpline: {BUSINESS_CONFIG.contact.phoneDisplay}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-slate-400">{BUSINESS_CONFIG.contact.email}</span>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <Link href="/" className="hover:text-emerald-500 hover:underline transition-colors">
                Home Page
              </Link>
            </li>
            <li>
              <Link href="/#products" className="hover:text-emerald-500 hover:underline transition-colors">
                Shop Products
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-emerald-500 hover:underline transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="hover:text-emerald-500 hover:underline transition-colors">
                Customer Reviews
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-emerald-500 hover:underline transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Service */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">
            Customer Service
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <span className="hover:text-emerald-500 cursor-not-allowed transition-colors">Track Order</span>
            </li>
            <li>
              <span className="hover:text-emerald-500 cursor-not-allowed transition-colors">Returns & Refunds</span>
            </li>
            <li>
              <span className="hover:text-emerald-500 cursor-not-allowed transition-colors">Shipping Policy</span>
            </li>
            <li>
              <span className="hover:text-emerald-500 cursor-not-allowed transition-colors">Terms & Conditions</span>
            </li>
            <li>
              <span className="hover:text-emerald-500 cursor-not-allowed transition-colors">Privacy Policy</span>
            </li>
            <li>
              <span className="hover:text-emerald-500 cursor-not-allowed transition-colors">FAQs & Support</span>
            </li>
          </ul>
        </div>

        {/* Column 4: My Account */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">
            My Account
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <Link href="/account" className="hover:text-emerald-500 hover:underline transition-colors">
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-emerald-500 hover:underline transition-colors">
                Wishlist
              </Link>
            </li>
            <li>
              <span className="hover:text-emerald-500 cursor-not-allowed transition-colors">Order History</span>
            </li>
            <li>
              <span className="hover:text-emerald-500 cursor-not-allowed transition-colors">Newsletter Settings</span>
            </li>
          </ul>
        </div>

        {/* Column 5: Follow Us & App Badges */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">
            Follow Us
          </h4>
          
          {/* Social icons */}
          <div className="flex gap-2">
            <a
              href={BUSINESS_CONFIG.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href={BUSINESS_CONFIG.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.008 3.74.052 1.455.067 2.25.3 2.77.5.69.27 1.18.59 1.7 1.1.51.52.83 1.01 1.1 1.7.2.52.43 1.316.5 2.77.045.955.052 1.31.052 3.74 0 2.43-.008 2.784-.052 3.74-.067 1.455-.3 2.25-.5 2.77-.27.69-.59 1.18-1.1 1.7-.52.51-1.01.83-1.7 1.1-.52.2-1.316.43-2.77.5-.955.045-1.31.052-3.74.052-2.43 0-2.784-.008-3.74-.052-1.455-.067-2.25-.3-2.77-.5-.69-.27-1.18-.59-1.7-1.1-.52-.83-1.01-1.1-1.7-.2-.52-.43-1.316-.5-2.77-.045-.955-.052-1.31-.052-3.74 0-2.43.008-2.784.052-3.74.067-1.455.3-2.25.5-2.77.27-.69.59-1.18 1.1-1.7.52-.51 1.01-.83 1.7-1.1.52-.2 1.316-.43 2.77-.5.955-.045 1.31-.052 3.74-.052zm.5 1.977c-2.408 0-2.714.01-3.66.053-.94.043-1.448.2-1.8.34-.467.18-.8.4-1.15.75-.35.35-.57.683-.75 1.15-.14.353-.3.86-.34 1.8-.043.947-.053 1.253-.053 3.66 0 2.407.01 2.714.053 3.66.043.94.2 1.448.34 1.8.18.467.4.8.75 1.15.35.35.683.57 1.15.75.353.14.86.3 1.8.34.947.043 1.253.053 3.66.053 2.407 0 2.714-.01 3.66-.053.94-.043 1.448-.2 1.8-.34.467-.18.8-.4 1.15-.75.35-.35.57-.683.75-1.15.14-.353.3-.86.34-1.8.043-.947.053-1.253.053-3.66 0-2.407-.01-2.714-.053-3.66-.043-.94-.2-1.448-.34-1.8-.18-.467-.4-.8-.75-1.15-.35-.35-.683-.57-1.15-.75-.353-.14-.86-.3-1.8-.34-.947-.043-1.253-.053-3.66-.053zm0 3.333a4.69 4.69 0 100 9.38 4.69 4.69 0 000-9.38zm0 7.403a2.713 2.713 0 110-5.426 2.713 2.713 0 010 5.426zm5.27-7.902a1.08 1.08 0 11-2.16 0 1.08 1.08 0 012.16 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href={BUSINESS_CONFIG.socials.whatsappDirect}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4.5 h-4.5" />
            </a>
          </div>

          {/* Secure Trust Badge Placeholder (matching the layout visual structure) */}
          <div className="bg-slate-850 p-3 rounded-lg border border-slate-800 flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
            <div className="leading-tight text-[10px]">
              <span className="block font-bold text-slate-200">Quality Assured</span>
              <span className="block text-slate-500">100% Genuine Sourcing</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW (Copyright, Payments) */}
      <div className="bg-slate-950 py-5 px-4 border-t border-slate-850">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
          <div className="text-center md:text-left">
            &copy; {currentYear} {BUSINESS_CONFIG.name}. All Rights Reserved.
          </div>
          
          {/* Payment gateway placeholder tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-slate-900 border border-slate-800 text-[9px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded">Cash on Delivery</span>
            <span className="bg-slate-900 border border-slate-800 text-[9px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded">Bank Transfer</span>
            <span className="bg-slate-900 border border-slate-800 text-[9px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded">EasyPaisa</span>
            <span className="bg-slate-900 border border-slate-800 text-[9px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded">JazzCash</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
