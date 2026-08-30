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
      {/* 1. TOP ANNOUNCEMENT BAR (Static on top) */}
      <TopBar />

      {/* STICKY CONTAINER FOR HEADER */}
      <div className={`sticky top-0 z-40 w-full transition-all duration-200 ${scrolled ? "shadow-md" : ""}`}>
        
        {/* 2. MAIN HEADER (Logo, Search, Actions) */}
        <header className="bg-white border-b border-slate-100 py-3.5 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
            
            {/* Logo Group */}
            <Link href="/" className="flex items-center gap-2 group shrink-0 focus:outline-none">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-sm group-hover:bg-emerald-700 transition-colors">
                U
              </div>
              <div className="hidden sm:block">
                <span className="block font-black text-slate-900 leading-tight text-base group-hover:text-emerald-600 transition-colors">
                  {BUSINESS_CONFIG.logo.text}
                </span>
                <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                  {BUSINESS_CONFIG.logo.subtitle}
                </span>
              </div>
            </Link>

            {/* Central Large Search Bar (Identical layout to screenshot) */}
            <div className="hidden md:flex flex-grow max-w-2xl relative">
              <div className="w-full flex">
                <input
                  type="text"
                  placeholder="Search products here..."
                  className="w-full bg-slate-50 border border-slate-200 border-r-0 rounded-l-md px-4 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-400"
                  disabled
                />
                <button
                  type="button"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase px-6 rounded-r-md transition-colors flex items-center gap-1.5 cursor-not-allowed opacity-90"
                  disabled
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Right Side Actions: Profile & Cart info */}
            <div className="flex items-center gap-3 md:gap-5">
              
              {/* Compare / Wishlist placeholders for tablet */}
              <Link href="/compare" className="hidden lg:flex p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 rounded-full transition-colors relative" aria-label="Compare">
                <RefreshCw className="w-5 h-5" />
              </Link>
              <Link href="/wishlist" className="hidden lg:flex p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 rounded-full transition-colors relative" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
              </Link>

              {/* Login/Register area */}
              <Link
                href="/account"
                className="flex items-center gap-2 text-left hover:text-emerald-600 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                  <User className="w-4.5 h-4.5" />
                </div>
                <div className="hidden sm:block leading-tight text-xs">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Account</span>
                  <span className="block font-bold text-slate-800">Login / Register</span>
                </div>
              </Link>

              <span className="text-slate-200 hidden sm:inline">|</span>

              {/* Cart Detail representation matching screenshot */}
              <Link
                href="/cart"
                className="flex items-center gap-2 hover:text-emerald-600 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center relative shrink-0">
                  <ShoppingCart className="w-4.5 h-4.5" />
                  <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-emerald-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                    0
                  </span>
                </div>
                <div className="hidden sm:block leading-tight text-xs">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">My Cart</span>
                  <span className="block font-bold text-slate-800">PKR 0.00</span>
                </div>
              </Link>

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-full transition-colors focus:outline-none"
                aria-label="Search"
              >
                <Search className="w-5.5 h-5.5" />
              </button>

              {/* Mobile Hamburger menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-full transition-colors focus:outline-none"
                aria-expanded={isMobileMenuOpen}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Input Toggled */}
          {isSearchOpen && (
            <div className="md:hidden pt-3 border-t border-slate-100 mt-2">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-slate-50 border border-slate-200 border-r-0 rounded-l-md px-3 py-1.5 text-xs focus:outline-none"
                  disabled
                />
                <button
                  type="button"
                  className="bg-emerald-600 text-white px-4 rounded-r-md text-xs font-bold cursor-not-allowed opacity-90"
                  disabled
                >
                  Go
                </button>
              </div>
            </div>
          )}
        </header>

        {/* 3. MAIN NAVIGATION ROW (All Categories, Links, Hotline) */}
        <div className="hidden lg:block">
          <MainNav />
        </div>

        {/* 4. MOBILE SLIDE-OUT DRAWER NAVIGATION */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-200 shadow-xl py-4 px-4 space-y-4">
            <nav className="flex flex-col gap-2">
              <Link href="/" className="px-3 py-2 rounded-md font-bold text-xs uppercase tracking-wider text-slate-800 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                Home
              </Link>
              <Link href="/#products" className="px-3 py-2 rounded-md font-bold text-xs uppercase tracking-wider text-slate-800 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                Shop
              </Link>
              <Link href="/about" className="px-3 py-2 rounded-md font-bold text-xs uppercase tracking-wider text-slate-800 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                About Us
              </Link>
              <Link href="/reviews" className="px-3 py-2 rounded-md font-bold text-xs uppercase tracking-wider text-slate-800 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                Reviews
              </Link>
              <Link href="/contact" className="px-3 py-2 rounded-md font-bold text-xs uppercase tracking-wider text-slate-800 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                Contact Us
              </Link>
            </nav>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="px-3 text-xs font-bold text-slate-700">
                Helpline: <a href={`tel:${BUSINESS_CONFIG.contact.phone}`} className="text-emerald-700 hover:underline">{BUSINESS_CONFIG.contact.phoneDisplay}</a>
              </div>
              <a
                href={BUSINESS_CONFIG.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center py-2.5 rounded-md text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>WhatsApp Live Chat</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
