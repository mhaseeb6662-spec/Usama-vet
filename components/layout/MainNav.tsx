"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, Phone, MessageCircle } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { MOCK_CATEGORIES } from "@/lib/data/mockData";

export default function MainNav() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const pathname = usePathname();

  // Close dropdown on route change
  useEffect(() => {
    setIsCategoriesOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="bg-white border-b border-slate-200 relative z-30">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-12">
        {/* Left Side: Solid Green Categories Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 h-12 text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-colors focus:outline-none"
            aria-expanded={isCategoriesOpen}
            aria-haspopup="menu"
          >
            <Menu className="w-4 h-4" />
            <span>Browse Categories</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoriesOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Categories Dropdown Menu */}
          {isCategoriesOpen && (
            <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 shadow-xl rounded-b-lg overflow-hidden py-1.5 focus:outline-none">
              {MOCK_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  role="menuitem"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          <Link
            href="/"
            className={`font-semibold text-xs uppercase tracking-wider transition-colors relative py-3.5 ${
              isActive("/") ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-750 hover:text-emerald-600"
            }`}
          >
            Home
          </Link>
          <Link
            href="/#products"
            className={`font-semibold text-xs uppercase tracking-wider transition-colors relative py-3.5 ${
              pathname.includes("#products") ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-750 hover:text-emerald-600"
            }`}
          >
            Shop
          </Link>
          <Link
            href="/about"
            className={`font-semibold text-xs uppercase tracking-wider transition-colors relative py-3.5 ${
              isActive("/about") ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-750 hover:text-emerald-600"
            }`}
          >
            About Us
          </Link>
          <Link
            href="/reviews"
            className={`font-semibold text-xs uppercase tracking-wider transition-colors relative py-3.5 ${
              isActive("/reviews") ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-750 hover:text-emerald-600"
            }`}
          >
            Reviews
          </Link>
          <Link
            href="/contact"
            className={`font-semibold text-xs uppercase tracking-wider transition-colors relative py-3.5 ${
              isActive("/contact") ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-750 hover:text-emerald-600"
            }`}
          >
            Contact Us
          </Link>
        </nav>

        {/* Right Side: Contact info + Social links */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-700">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Helpline: <a href={`tel:${BUSINESS_CONFIG.contact.phone}`} className="hover:underline">{BUSINESS_CONFIG.contact.phoneDisplay}</a></span>
          </div>

          <span className="hidden md:inline text-slate-300">|</span>

          {/* Small Social Links */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href={BUSINESS_CONFIG.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-emerald-600 transition-colors"
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
              className="text-slate-400 hover:text-emerald-600 transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.008 3.74.052 1.455.067 2.25.3 2.77.5.69.27 1.18.59 1.7 1.1.51.52.83 1.01 1.1 1.7.2.52.43 1.316.5 2.77.045.955.052 1.31.052 3.74 0 2.43-.008 2.784-.052 3.74-.067 1.455-.3 2.25-.5 2.77-.27.69-.59 1.18-1.1 1.7-.52.51-1.01.83-1.7 1.1-.52.2-1.316.43-2.77.5-.955.045-1.31.052-3.74.052-2.43 0-2.784-.008-3.74-.052-1.455-.067-2.25-.3-2.77-.5-.69-.27-1.18-.59-1.7-1.1-.51-.52-.83-1.01-1.1-1.7-.2-.52-.43-1.316-.5-2.77-.045-.955-.052-1.31-.052-3.74 0-2.43.008-2.784.052-3.74.067-1.455.3-2.25.5-2.77.27-.69.59-1.18 1.1-1.7.52-.51 1.01-.83 1.7-1.1.52-.2 1.316-.43 2.77-.5.955-.045 1.31-.052 3.74-.052zm.5 1.977c-2.408 0-2.714.01-3.66.053-.94.043-1.448.2-1.8.34-.467.18-.8.4-1.15.75-.35.35-.57.683-.75 1.15-.14.353-.3.86-.34 1.8-.043.947-.053 1.253-.053 3.66 0 2.407.01 2.714.053 3.66.043.94.2 1.448.34 1.8.18.467.4.8.75 1.15.35.35.683.57 1.15.75.353.14.86.3 1.8.34.947.043 1.253.053 3.66.053 2.407 0 2.714-.01 3.66-.053.94-.043 1.448-.2 1.8-.34.467-.18.8-.4 1.15-.75.35-.35.57-.683.75-1.15.14-.353.3-.86.34-1.8.043-.947.053-1.253.053-3.66 0-2.407-.01-2.714-.053-3.66-.043-.94-.2-1.448-.34-1.8-.18-.467-.4-.8-.75-1.15-.35-.35-.683-.57-1.15-.75-.353-.14-.86-.3-1.8-.34-.947-.043-1.253-.053-3.66-.053zm0 3.333a4.69 4.69 0 100 9.38 4.69 4.69 0 000-9.38zm0 7.403a2.713 2.713 0 110-5.426 2.713 2.713 0 010 5.426zm5.27-7.902a1.08 1.08 0 11-2.16 0 1.08 1.08 0 012.16 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href={BUSINESS_CONFIG.socials.whatsappDirect}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-emerald-650 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
