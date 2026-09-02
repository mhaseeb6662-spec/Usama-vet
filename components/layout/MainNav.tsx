"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, ChevronDown, ChevronRight, Phone, MapPin, 
  Pill, Milk, Activity, Feather, Heart, Grid, Sparkles, Shield 
} from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { motion, AnimatePresence } from "framer-motion";

const ICON_MAP: Record<string, React.ElementType> = {
  Pills: Pill, Milk, Activity, Feather, Heart, Grid, Sparkles, Shield
};

export default function MainNav({ categories = [] }: { categories?: any[] }) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Close dropdown on route change
  useEffect(() => {
    setIsCategoriesOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsCategoriesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsCategoriesOpen(false);
    }, 150); // 150ms hover bridge delay
  };

  return (
    <div className="bg-[#f0f8f5]/80 backdrop-blur-xl border-b border-slate-200/60 relative z-40">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-14">
        
        {/* Left Side: Solid Green Categories Button with Hover Bridge */}
        <div 
          className="relative h-full flex items-center"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="bg-[#009473] hover:bg-[#028467] text-white px-6 py-3 rounded-md text-[14px] font-semibold uppercase flex items-center gap-2.5 transition-colors focus:outline-none hover-scale-subtle"
            aria-expanded={isCategoriesOpen}
            aria-haspopup="menu"
          >
            <Menu className="w-5 h-5 shrink-0" />
            <span>CATEGORIES</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 shrink-0 ${isCategoriesOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Categories Dropdown Menu - Mega Menu */}
          <AnimatePresence>
            {isCategoriesOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.985 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-full left-0 pt-2 w-[550px] z-50 origin-top-left"
              >
                <div className="bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden p-3 flex flex-col">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {categories.map((cat) => {
                      const Icon = ICON_MAP[cat.iconName || cat.icon] || ChevronRight;
                      return (
                        <Link
                          key={cat.id}
                          href={`/categories/${cat.slug}`}
                          onClick={() => setIsCategoriesOpen(false)}
                          className="flex items-center justify-between px-3 py-3 rounded-md text-[14px] font-medium text-slate-700 hover:bg-[#eef8f4] hover:text-[#009473] transition-colors duration-150 group/cat"
                          role="menuitem"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-slate-400 group-hover/cat:text-[#009473] transition-colors" />
                            <span>{cat.name}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/cat:opacity-100 group-hover/cat:translate-x-0 transition-transform duration-200 text-[#009473]" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center-Left: Page Links with Exact Case Matching */}
        <nav className="flex items-center gap-8 ml-8 mr-auto h-full">
          <Link
            href="/"
            className={`font-semibold text-[15px] transition-colors relative py-4 nav-link-underline h-full flex items-center ${
              pathname === "/" ? "text-[#009473]" : "text-slate-800 hover:text-[#009473]"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`font-semibold text-[15px] transition-colors relative py-4 nav-link-underline h-full flex items-center ${
              isActive("/about") ? "text-[#009473]" : "text-slate-800 hover:text-[#009473]"
            }`}
          >
            About us
          </Link>
          <Link
            href="/reviews"
            className={`font-semibold text-[15px] transition-colors relative py-4 nav-link-underline h-full flex items-center ${
              isActive("/reviews") ? "text-[#009473]" : "text-slate-800 hover:text-[#009473]"
            }`}
          >
            Reviews
          </Link>
          <Link
            href="/how-to-order"
            className={`font-semibold text-[15px] transition-colors relative py-4 nav-link-underline h-full flex items-center ${
              isActive("/how-to-order") ? "text-[#009473]" : "text-slate-800 hover:text-[#009473]"
            }`}
          >
            How to Order
          </Link>
          <Link
            href="/contact"
            className={`font-semibold text-[15px] transition-colors relative py-4 nav-link-underline h-full flex items-center ${
              isActive("/contact") ? "text-[#009473]" : "text-slate-800 hover:text-[#009473]"
            }`}
          >
            Contact Us
          </Link>
        </nav>

        {/* Right Side: Hotline & Tracking with matching icons */}
        <div className="flex items-center gap-6 text-[14px] font-semibold text-slate-800 shrink-0">
          {/* Call Us */}
          <a 
            href={`tel:${BUSINESS_CONFIG.contact.phone.replace(/[^0-9+]/g, '')}`} 
            className="flex items-center gap-2 hover:text-[#009473] transition-colors"
          >
            <Phone className="w-4 h-4 text-[#009473]" />
            <span>Call Us {BUSINESS_CONFIG.contact.phoneDisplay}</span>
          </a>

          {/* Track Order */}
          <Link
            href="/track-order"
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
