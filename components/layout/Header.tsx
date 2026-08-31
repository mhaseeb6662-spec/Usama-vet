"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import TopBar from "./TopBar";
import MainNav from "./MainNav";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const menuLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/#products" },
    { name: "About Us", href: "/about" },
    { name: "Reviews", href: "/reviews" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT TICKER (Fade/Slide load sequence) */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <TopBar />
      </motion.div>

      {/* STICKY CONTAINER FOR HEADER (Staggered load sequence) */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${scrolled ? "shadow-md" : ""}`}
      >
        {/* 2. MAIN HEADER (Logo, Search Pill, Actions) */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 py-5 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-6">
            
            {/* Logo Group */}
            <Link href="/" className="flex items-center gap-3 group shrink-0 focus:outline-none">
              <div className="w-16 h-16 rounded-full shadow-sm shrink-0 overflow-hidden bg-slate-50 border border-slate-200">
                <Image src="/logo.jpg" alt="Veterinary Logo" width={64} height={64} className="w-full h-full object-cover" unoptimized />
              </div>
              <div className="hidden sm:block leading-none text-left">
                <span className="block font-bold text-slate-800 text-[22px] group-hover:text-[#009473] transition-colors uppercase">
                  {BUSINESS_CONFIG.shortName}
                </span>
                <span className="block text-[11px] text-slate-450 font-medium uppercase mt-1">
                  Veterinary Pharmacy
                </span>
              </div>
            </Link>

            {/* Pill Search Bar */}
            <div className="hidden md:flex flex-grow max-w-2xl relative">
              <div className="w-full flex items-center bg-slate-100/70 border border-slate-200 rounded-full pl-5 pr-2 py-1.5 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:shadow-sm transition-all duration-200 group/search">
                <input
                  type="text"
                  placeholder="What Are You Looking For..."
                  className="w-full bg-transparent text-[14px] text-slate-850 outline-none placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-[#009473] hover:bg-[#028467] text-white flex items-center justify-center shrink-0 hover:scale-[1.02] active:scale-[0.97] transition-all duration-150 group-focus-within/search:bg-emerald-700"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Side Actions: Login & Cart */}
            <div className="flex items-center gap-6 shrink-0">
              
              {/* Login / Register Link */}
              <Link
                href="/account"
                className="flex items-center gap-2.5 hover:text-[#009473] transition-colors focus:outline-none text-left group"
              >
                <div className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-550 shrink-0 hover-scale-subtle">
                  <User className="w-5 h-5" />
                </div>
                <span className="hidden lg:inline text-[15px] font-semibold text-slate-700 group-hover:text-[#009473] transition-colors">
                  Login / Register
                </span>
              </Link>

              {/* Cart link */}
              <Link
                href="/cart"
                className="flex items-center gap-2.5 hover:text-[#009473] transition-colors focus:outline-none text-left group"
              >
                <div className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-550 shrink-0 relative hover-scale-subtle">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#009473] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    0
                  </span>
                </div>
                <span className="hidden lg:inline text-[15px] font-semibold text-slate-700 group-hover:text-[#009473] transition-colors">
                  Cart
                </span>
              </Link>

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-[#009473] hover:bg-slate-50 rounded-full transition-colors focus:outline-none hover-scale-subtle"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-[#009473] hover:bg-slate-50 rounded-full transition-colors focus:outline-none hover-scale-subtle"
                aria-expanded={isMobileMenuOpen}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Input focus transition */}
          {isSearchOpen && (
            <div className="md:hidden pt-3 border-t border-slate-100 mt-2">
              <div className="flex bg-slate-100/70 border border-slate-200 rounded-full pl-3 pr-1 py-1 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:shadow-sm transition-all duration-200">
                <input
                  type="text"
                  placeholder="What Are You Looking For"
                  className="w-full bg-transparent text-xs text-slate-800 outline-none focus:outline-none"
                />
                <button
                  type="button"
                  className="w-7 h-7 rounded-full bg-[#009473] text-white flex items-center justify-center shrink-0 hover:scale-[1.02] active:scale-[0.97] transition-all duration-150"
                  aria-label="Search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </header>

        {/* 3. MAIN NAVIGATION ROW (Staggered load sequence) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <MainNav />
        </motion.div>

        {/* 4. MOBILE SLIDE-OUT MENU DRAWER */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-200 shadow-xl py-4 px-4 space-y-4 overflow-hidden"
            >
              <motion.nav
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: shouldReduceMotion ? 0 : 0.04
                    }
                  }
                }}
                className="flex flex-col gap-2"
              >
                {menuLinks.map((link) => (
                  <motion.div
                    key={link.name}
                    variants={{
                      hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -8 },
                      show: { opacity: 1, x: 0 }
                    }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      className="px-3 py-2 rounded-md font-semibold text-xs uppercase text-slate-800 hover:bg-slate-50 hover:text-emerald-600 transition-colors block"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="pt-4 border-t border-slate-100 space-y-3"
              >
                <div className="px-3 text-xs font-semibold text-slate-700">
                  Call Us: <a href={`tel:${BUSINESS_CONFIG.contact.phone.replace(/[^0-9+]/g, '')}`} className="text-emerald-700 hover:underline">{BUSINESS_CONFIG.contact.phoneDisplay}</a>
                </div>
                <div className="px-3 text-xs font-semibold text-slate-700">
                  Track Your Order
                </div>
                <a
                  href={BUSINESS_CONFIG.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-3 bg-[#009473] hover:bg-[#028467] text-white font-semibold text-center py-2.5 rounded-md text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95 duration-150"
                >
                  <span>WhatsApp Support</span>
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
