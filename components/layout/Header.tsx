"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, Heart, RefreshCw } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import TopBar from "./TopBar";
import MainNav from "./MainNav";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT TICKER (Static on top) */}
      <TopBar />

      {/* STICKY CONTAINER FOR HEADER */}
      <div className={`sticky top-0 z-40 w-full transition-all duration-200 ${scrolled ? "shadow-md" : ""}`}>
        
        {/* 2. MAIN HEADER (Logo, Search Pill, Actions) */}
        <header className="bg-white border-b border-slate-100 py-3.5 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
            
            {/* Logo Group (Aligned with Qadri logo visuals) */}
            <Link href="/" className="flex items-center gap-2 group shrink-0 focus:outline-none">
              <div className="w-10 h-10 bg-[#009473] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-[#028467] transition-colors shrink-0">
                U
              </div>
              <div className="hidden sm:block leading-none text-left">
                <span className="block font-bold text-slate-800 text-[17px] group-hover:text-[#009473] transition-colors uppercase">
                  {BUSINESS_CONFIG.shortName}
                </span>
                <span className="block text-[9px] text-slate-450 font-medium uppercase mt-0.5">
                  Veterinary Pharmacy
                </span>
              </div>
            </Link>

            {/* Pill Search Bar (Exactly matching Qadri Gadgets search pill layout) */}
            <div className="hidden md:flex flex-grow max-w-xl relative">
              <div className="w-full flex items-center bg-slate-100/70 border border-slate-200 rounded-full pl-4 pr-1 py-1">
                <input
                  type="text"
                  placeholder="What Are You Looking For"
                  className="w-full bg-transparent text-xs text-slate-850 outline-none placeholder:text-slate-400 focus:outline-none"
                  disabled
                />
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-[#009473] hover:bg-[#028467] text-white flex items-center justify-center shrink-0 transition-colors cursor-not-allowed"
                  disabled
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Side Actions: Login & Cart */}
            <div className="flex items-center gap-4 shrink-0">
              
              {/* Login / Register Link with circle avatar outline */}
              <Link
                href="/account"
                className="flex items-center gap-2 hover:text-[#009473] transition-colors focus:outline-none text-left"
              >
                <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-550 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden lg:inline text-[13px] font-semibold text-slate-705">
                  Login / Register
                </span>
              </Link>

              {/* Cart link with circle bag outline */}
              <Link
                href="/cart"
                className="flex items-center gap-2 hover:text-[#009473] transition-colors focus:outline-none text-left"
              >
                <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-550 shrink-0 relative">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#009473] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                    0
                  </span>
                </div>
                <span className="hidden lg:inline text-[13px] font-semibold text-slate-705">
                  Cart
                </span>
              </Link>

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-[#009473] hover:bg-slate-50 rounded-full transition-colors focus:outline-none"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-[#009473] hover:bg-slate-50 rounded-full transition-colors focus:outline-none"
                aria-expanded={isMobileMenuOpen}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Input */}
          {isSearchOpen && (
            <div className="md:hidden pt-3 border-t border-slate-100 mt-2">
              <div className="flex bg-slate-100/70 border border-slate-200 rounded-full pl-3 pr-1 py-1">
                <input
                  type="text"
                  placeholder="What Are You Looking For"
                  className="w-full bg-transparent text-xs text-slate-800 outline-none"
                  disabled
                />
                <button
                  type="button"
                  className="w-7 h-7 rounded-full bg-[#009473] text-white flex items-center justify-center shrink-0 cursor-not-allowed"
                  disabled
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </header>

        {/* 3. MAIN NAVIGATION ROW (Categories dropdown, Links, Hotline, Track order) */}
        <div className="hidden lg:block">
          <MainNav />
        </div>

        {/* 4. MOBILE SLIDE-OUT MENU DRAWER */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-200 shadow-xl py-4 px-4 space-y-4">
            <nav className="flex flex-col gap-2">
              <Link href="/" className="px-3 py-2 rounded-md font-semibold text-xs uppercase text-slate-800 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                Home
              </Link>
              <Link href="/#products" className="px-3 py-2 rounded-md font-semibold text-xs uppercase text-slate-800 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                Shop
              </Link>
              <Link href="/about" className="px-3 py-2 rounded-md font-semibold text-xs uppercase text-slate-800 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                About Us
              </Link>
              <Link href="/reviews" className="px-3 py-2 rounded-md font-semibold text-xs uppercase text-slate-800 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                Reviews
              </Link>
              <Link href="/contact" className="px-3 py-2 rounded-md font-semibold text-xs uppercase text-slate-800 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                Contact Us
              </Link>
            </nav>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="px-3 text-xs font-semibold text-slate-700">
                Call Us: <a href="tel:03302760775" className="text-emerald-700 hover:underline">0330-2760775</a>
              </div>
              <div className="px-3 text-xs font-semibold text-slate-700">
                Track Your Order
              </div>
              <a
                href={BUSINESS_CONFIG.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-3 bg-[#009473] hover:bg-[#028467] text-white font-semibold text-center py-2.5 rounded-md text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
