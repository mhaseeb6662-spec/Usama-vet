"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import AccountMenu from "@/components/account/AccountMenu";
import HeaderSearch from "@/components/search/HeaderSearch";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import TopBar from "./TopBar";
import MainNav from "./MainNav";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";

type NavCategory = {
  id: string;
  slug: string;
  name: string;
  iconName?: string;
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<NavCategory[]>([]);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const { count } = useCart();

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

  useEffect(() => {
    fetch("/api/categories")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Could not load categories.");
        }
        setCategories(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const menuLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Reviews", href: "/reviews" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT TICKER (Fade/Slide load sequence) */}
      <div>
        <TopBar />
      </div>

      <div
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
              <div className="leading-none text-left">
                <span className="block font-bold text-slate-800 text-[16px] sm:text-[20px] group-hover:text-[#009473] transition-colors">
                  Usamavet & Surgical
                </span>
              </div>
            </Link>

            {/* Pill Search Bar */}
            <div className="hidden md:flex flex-grow min-w-0 max-w-2xl relative">
              <HeaderSearch variant="desktop" />
            </div>

            {/* Right Side Actions: Login & Cart */}
            <div className="flex items-center gap-6 shrink-0">
              
              <AccountMenu />

              {/* Cart link */}
              <Link
                href="/cart"
                className="flex items-center gap-2.5 hover:text-[#009473] transition-colors focus:outline-none text-left group"
              >
                <div className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-550 shrink-0 relative hover-scale-subtle">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#009473] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {count}
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
              <HeaderSearch variant="mobile" />
            </div>
          )}
        </header>

        <div className="hidden lg:block w-full">
          <MainNav categories={categories} />
        </div>

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
                <Link href="/track-order" className="px-3 text-xs font-semibold text-slate-700 hover:text-emerald-700">
                  Track Your Order
                </Link>
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
      </div>
    </>
  );
}
