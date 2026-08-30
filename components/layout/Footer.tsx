"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Mimic API delay
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail("");
    }, 1200);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* NEWSLETTER/CTA SECTION */}
      <div className="border-b border-slate-800 py-10 px-4 bg-slate-950/40">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="text-center lg:text-left max-w-md">
            <h3 className="text-lg font-bold text-white mb-2">
              Subscribe to Animal Health Updates
            </h3>
            <p className="text-xs text-slate-400">
              Get the latest updates on veterinary medicine availability, seasonal livestock care advice, and exclusive product discounts.
            </p>
          </div>
          <div className="w-full max-w-md">
            {subscribed ? (
              <div className="bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs px-4 py-3 rounded-lg text-center font-medium">
                Thank you! You have successfully subscribed to our newsletter.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-sm px-5 py-2.5 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500"
                >
                  {loading ? "Subscribed..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* CORE FOOTER GRID */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1: Branding & Intro */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-bold text-lg shadow">
              U
            </div>
            <div>
              <span className="block font-bold text-white leading-none text-base">
                {BUSINESS_CONFIG.name}
              </span>
              <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-semibold">
                {BUSINESS_CONFIG.logo.subtitle}
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            {BUSINESS_CONFIG.description}
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href={BUSINESS_CONFIG.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href={BUSINESS_CONFIG.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.008 3.74.052 1.455.067 2.25.3 2.77.5.69.27 1.18.59 1.7 1.1.51.52.83 1.01 1.1 1.7.2.52.43 1.316.5 2.77.045.955.052 1.31.052 3.74 0 2.43-.008 2.784-.052 3.74-.067 1.455-.3 2.25-.5 2.77-.27.69-.59 1.18-1.1 1.7-.52.51-1.01.83-1.7 1.1-.52.2-1.316.43-2.77.5-.955.045-1.31.052-3.74.052-2.43 0-2.784-.008-3.74-.052-1.455-.067-2.25-.3-2.77-.5-.69-.27-1.18-.59-1.7-1.1-.51-.52-.83-1.01-1.1-1.7-.2-.52-.43-1.316-.5-2.77-.045-.955-.052-1.31-.052-3.74 0-2.43.008-2.784.052-3.74.067-1.455.3-2.25.5-2.77.27-.69.59-1.18 1.1-1.7.52-.51 1.01-.83 1.7-1.1.52-.2 1.316-.43 2.77-.5.955-.045 1.31-.052 3.74-.052zm.5 1.977c-2.408 0-2.714.01-3.66.053-.94.043-1.448.2-1.8.34-.467.18-.8.4-1.15.75-.35.35-.57.683-.75 1.15-.14.353-.3.86-.34 1.8-.043.947-.053 1.253-.053 3.66 0 2.407.01 2.714.053 3.66.043.94.2 1.448.34 1.8.18.467.4.8.75 1.15.35.35.683.57 1.15.75.353.14.86.3 1.8.34.947.043 1.253.053 3.66.053 2.407 0 2.714-.01 3.66-.053.94-.043 1.448-.2 1.8-.34.467-.18.8-.4 1.15-.75.35-.35.57-.683.75-1.15.14-.353.3-.86.34-1.8.043-.947.053-1.253.053-3.66 0-2.407-.01-2.714-.053-3.66-.043-.94-.2-1.448-.34-1.8-.18-.467-.4-.8-.75-1.15-.35-.35-.683-.57-1.15-.75-.353-.14-.86-.3-1.8-.34-.947-.043-1.253-.053-3.66-.053zm0 3.333a4.69 4.69 0 100 9.38 4.69 4.69 0 000-9.38zm0 7.403a2.713 2.713 0 110-5.426 2.713 2.713 0 010 5.426zm5.27-7.902a1.08 1.08 0 11-2.16 0 1.08 1.08 0 012.16 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href={BUSINESS_CONFIG.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Twitter"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
            Quick Navigation
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/" className="hover:text-emerald-500 hover:underline transition-colors">
                Home Page
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-emerald-500 hover:underline transition-colors">
                About Our Clinic & Shop
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="hover:text-emerald-500 hover:underline transition-colors">
                Customer Reviews
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-emerald-500 hover:underline transition-colors">
                Contact & Support
              </Link>
            </li>
            <li>
              <Link href="/#products" className="hover:text-emerald-500 hover:underline transition-colors">
                Veterinary Products
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Categories Placeholder */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
            Product Categories
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/#products" className="hover:text-emerald-500 hover:underline transition-colors">
                Veterinary Medicines
              </Link>
            </li>
            <li>
              <Link href="/#products" className="hover:text-emerald-500 hover:underline transition-colors">
                Livestock Products
              </Link>
            </li>
            <li>
              <Link href="/#products" className="hover:text-emerald-500 hover:underline transition-colors">
                Animal Supplements
              </Link>
            </li>
            <li>
              <Link href="/#products" className="hover:text-emerald-500 hover:underline transition-colors">
                Farm & Animal Care
              </Link>
            </li>
            <li>
              <Link href="/#products" className="hover:text-emerald-500 hover:underline transition-colors">
                Pet Care Specials
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Hours */}
        <div className="space-y-3.5 text-xs">
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
            Contact Information
          </h4>
          <div className="flex gap-2">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed text-slate-400">
              {BUSINESS_CONFIG.contact.address}
            </span>
          </div>
          <div className="flex gap-2">
            <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-slate-400">
              Helpline: {BUSINESS_CONFIG.contact.phoneDisplay}
            </span>
          </div>
          <div className="flex gap-2">
            <Clock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-slate-400">
              {BUSINESS_CONFIG.hours.map((h, i) => (
                <div key={i} className="mb-0.5">
                  <span className="font-medium text-slate-300">{h.days}: </span>
                  <span>{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM LEGAL BAR */}
      <div className="bg-slate-950 py-6 px-4 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="text-center md:text-left">
            &copy; {currentYear} {BUSINESS_CONFIG.name}. All Rights Reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="text-slate-600">Privacy Policy</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-600">Terms of Service</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-600">Delivery Information</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
