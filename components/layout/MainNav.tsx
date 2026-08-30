"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, Phone, MapPin } from "lucide-react";
import { MOCK_CATEGORIES } from "@/lib/data/mockData";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="bg-[#f0f8f5] border-b border-slate-200/60 relative z-30">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-11">
        {/* Left Side: Solid Green Categories Button */}
        <div className="relative">
          <button
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="bg-[#009473] hover:bg-[#028467] text-white px-4 py-2 rounded-md text-[12px] font-semibold uppercase flex items-center gap-2 transition-colors focus:outline-none hover-scale-subtle"
            aria-expanded={isCategoriesOpen}
            aria-haspopup="menu"
          >
            <Menu className="w-3.5 h-3.5 shrink-0" />
            <span>CATEGORIES</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${isCategoriesOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Categories Dropdown Menu */}
          <AnimatePresence>
            {isCategoriesOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-full left-0 w-64 bg-white border border-slate-200 shadow-xl rounded-b-lg overflow-hidden py-1.5 focus:outline-none"
              >
                {MOCK_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="block px-4 py-2 text-[12px] font-medium text-slate-700 hover:bg-[#f0f8f5] hover:text-[#009473] hover:translate-x-[2px] transition-all duration-200 ease-out"
                    role="menuitem"
                  >
                    {cat.name}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center-Left: Page Links with Exact Case Matching */}
        <nav className="flex items-center gap-8 ml-6 mr-auto">
          <Link
            href="/"
            className={`font-semibold text-[13px] transition-colors relative py-3 nav-link-underline ${
              pathname === "/" ? "text-[#009473]" : "text-slate-800 hover:text-[#009473]"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`font-semibold text-[13px] transition-colors relative py-3 nav-link-underline ${
              isActive("/about") ? "text-[#009473]" : "text-slate-800 hover:text-[#009473]"
            }`}
          >
            About us
          </Link>
          <Link
            href="/reviews"
            className={`font-semibold text-[13px] transition-colors relative py-3 nav-link-underline ${
              isActive("/reviews") ? "text-[#009473]" : "text-slate-800 hover:text-[#009473]"
            }`}
          >
            Reviews
          </Link>
          <Link
            href="/contact"
            className={`font-semibold text-[13px] transition-colors relative py-3 nav-link-underline ${
              isActive("/contact") ? "text-[#009473]" : "text-slate-800 hover:text-[#009473]"
            }`}
          >
            Contact Us
          </Link>
        </nav>

        {/* Right Side: Hotline & Tracking with matching icons */}
        <div className="flex items-center gap-6 text-[13px] font-semibold text-slate-800 shrink-0">
          
          {/* Hotline */}
          <a
            href="tel:03302760775"
            className="flex items-center gap-2 hover:text-[#009473] transition-colors"
          >
            <Phone className="w-4 h-4 text-[#009473]" />
            <span>Call Us 0330-2760775</span>
          </a>

          {/* Track Order */}
          <Link
            href="/order-tracking"
            className="flex items-center gap-2 hover:text-[#009473] transition-colors"
          >
            <MapPin className="w-4 h-4 text-[#009473]" />
            <span>Track Your Order</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
