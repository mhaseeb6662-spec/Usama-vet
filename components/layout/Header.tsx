"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, Phone, Heart } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* TOP HELP BAR - Highly common and trust-building for premium e-commerce */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="flex items-center gap-1 font-light">
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> Helpline:{" "}
              <a href={`tel:${BUSINESS_CONFIG.contact.phone}`} className="hover:text-emerald-400 font-medium transition-colors">
                {BUSINESS_CONFIG.contact.phoneDisplay}
              </a>
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline font-light">
              Hours: {BUSINESS_CONFIG.hours[0].time}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={BUSINESS_CONFIG.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors flex items-center gap-1"
            >
              <span>WhatsApp Support</span>
            </a>
            <span className="text-slate-700">|</span>
            <span className="text-slate-300 font-medium bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40 text-[10px] tracking-wide uppercase">
              Nationwide Delivery
            </span>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR - STICKY */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-3"
            : "bg-white shadow-sm py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group focus:outline-none">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
              U
            </div>
            <div>
              <span className="block font-bold text-slate-900 leading-tight text-lg group-hover:text-emerald-600 transition-colors">
                {BUSINESS_CONFIG.logo.text}
              </span>
              <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                {BUSINESS_CONFIG.logo.subtitle}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {BUSINESS_CONFIG.navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`font-medium text-sm transition-colors relative py-1 focus:outline-none hover:text-emerald-600 ${
                  isActive(item.href)
                    ? "text-emerald-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-600"
                    : "text-slate-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Header Action Placeholders */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Placeholder */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-lg shadow-xl border border-slate-100 p-3 z-50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search veterinary medicines..."
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-emerald-500"
                      disabled
                    />
                    <span className="bg-emerald-600 text-white text-[10px] px-2.5 flex items-center justify-center font-medium rounded opacity-60 cursor-not-allowed">
                      Search
                    </span>
                  </div>
                  <span className="block mt-2 text-[10px] text-slate-400 italic">
                    Search features will be enabled soon.
                  </span>
                </div>
              )}
            </div>

            {/* Account Profile Placeholder */}
            <Link
              href="/account"
              className="p-2 text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="User Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Icon Placeholder with counter */}
            <Link
              href="/cart"
              className="p-2 text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                0
              </span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 lg:hidden text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-out Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-lg py-4 px-4 space-y-3 z-50">
            <nav className="flex flex-col gap-3">
              {BUSINESS_CONFIG.navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md font-medium text-sm transition-colors ${
                    isActive(item.href)
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 px-3">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Call Helpline: {BUSINESS_CONFIG.contact.phoneDisplay}</span>
              </div>
              <a
                href={BUSINESS_CONFIG.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-3 mt-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-center py-2 rounded-md text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>WhatsApp Live Chat</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
