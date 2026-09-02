"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronRight,
  Phone,
  MapPin,
  Pill,
  Milk,
  Activity,
  Feather,
  Heart,
  Grid,
  Sparkles,
  Shield,
} from "lucide-react";
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

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  Pills: Pill,
  Milk,
  Activity,
  Feather,
  Heart,
  Grid,
  Sparkles,
  Shield,
};

const menuLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Reviews", href: "/reviews" },
  { name: "How to Order", href: "/how-to-order" },
  { name: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<NavCategory[]>([]);
  const [categoriesError, setCategoriesError] = useState("");
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    fetch("/api/categories")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Could not load categories.");
        }
        setCategories(data.data);
        setCategoriesError("");
      })
      .catch((error) => {
        console.error(error);
        setCategories([]);
        setCategoriesError(error instanceof Error ? error.message : "Could not load categories.");
      });
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const drawerMotion = {
    duration: shouldReduceMotion ? 0 : 0.28,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <>
      <div>
        <TopBar />
      </div>

      <div
        className={`sticky top-0 z-40 w-full relative transition-all duration-200 ${scrolled ? "shadow-md" : ""}`}
      >
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 py-3 px-3 sm:py-5 sm:px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 sm:gap-4 lg:gap-6 min-w-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0 group focus:outline-none">
              <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full shadow-sm shrink-0 overflow-hidden bg-slate-50 border border-slate-200">
                <Image src="/logo.jpg" alt="Veterinary Logo" width={64} height={64} className="w-full h-full object-cover" unoptimized />
              </div>
              <div className="leading-tight text-left min-w-0">
                <span className="block font-bold text-slate-800 text-[13px] sm:text-[16px] lg:text-[20px] group-hover:text-[#009473] transition-colors break-words">
                  Usamavet & Surgical
                </span>
              </div>
            </Link>

            <div className="hidden md:flex flex-grow min-w-0 max-w-2xl relative">
              <HeaderSearch variant="desktop" />
            </div>

            <div className="flex items-center gap-1 sm:gap-2.5 lg:gap-6 shrink-0">
              <AccountMenu />

              <Link
                href="/cart"
                className="flex items-center gap-2.5 hover:text-[#009473] transition-colors focus:outline-none text-left group"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-550 shrink-0 relative hover-scale-subtle">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#009473] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {count}
                  </span>
                </div>
                <span className="hidden lg:inline text-[15px] font-semibold text-slate-700 group-hover:text-[#009473] transition-colors">
                  Cart
                </span>
              </Link>

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center text-slate-600 hover:text-[#009473] hover:bg-slate-50 rounded-full border border-slate-200 bg-white transition-colors focus:outline-none hover-scale-subtle"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center text-slate-700 hover:text-[#009473] hover:bg-[#eef8f4] rounded-full border border-slate-200 bg-white transition-colors focus:outline-none hover-scale-subtle"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu-drawer"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isSearchOpen && (
            <div className="md:hidden pt-3 border-t border-slate-100 mt-2">
              <HeaderSearch variant="mobile" />
            </div>
          )}
        </header>

        <div className="hidden lg:block w-full">
          <MainNav categories={categories} />
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[10050]" role="dialog" aria-modal="true" aria-label="Menu">
            <motion.button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-slate-900/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={drawerMotion}
              onClick={closeMobileMenu}
            />
            <motion.aside
              id="mobile-menu-drawer"
              initial={{ x: shouldReduceMotion ? 0 : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: shouldReduceMotion ? 0 : "100%" }}
              transition={drawerMotion}
              className="absolute top-0 right-0 h-full w-[min(86vw,340px)] bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <p className="text-[15px] font-bold text-slate-800">Menu</p>
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:text-[#009473] hover:bg-[#eef8f4]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                <nav className="flex flex-col gap-1">
                  {menuLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={closeMobileMenu}
                        className={`px-3 py-2.5 rounded-lg text-[14px] font-semibold transition-colors ${
                          active
                            ? "bg-[#eef8f4] text-[#009473]"
                            : "text-slate-800 hover:bg-slate-50 hover:text-[#009473]"
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>

                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-[#009473] text-white px-3 py-2.5 text-[13px] font-semibold uppercase flex items-center gap-2">
                    <Menu className="w-4 h-4 shrink-0" />
                    <span>Categories</span>
                  </div>
                  <div className="p-1.5">
                    {categoriesError ? (
                      <p className="px-3 py-2.5 text-xs text-rose-600">{categoriesError}</p>
                    ) : categories.length === 0 ? (
                      <p className="px-3 py-2.5 text-xs text-slate-500">
                        Categories will appear here once they are published from the admin dashboard.
                      </p>
                    ) : (
                      categories.map((category) => {
                        const Icon = CATEGORY_ICON_MAP[category.iconName || ""] || ChevronRight;
                        const active = pathname === `/categories/${category.slug}`;
                        return (
                          <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            onClick={closeMobileMenu}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors ${
                              active
                                ? "bg-[#eef8f4] text-[#009473]"
                                : "text-slate-700 hover:bg-[#eef8f4] hover:text-[#009473]"
                            }`}
                          >
                            <span className="flex items-center gap-3 min-w-0">
                              <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                              <span className="truncate">{category.name}</span>
                            </span>
                            <ChevronRight className="w-4 h-4 shrink-0 text-[#009473]" />
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 px-4 py-3 space-y-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <a
                  href={`tel:${BUSINESS_CONFIG.contact.phone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-2 px-1 text-[13px] font-semibold text-slate-700 hover:text-[#009473]"
                >
                  <Phone className="w-4 h-4 text-[#009473]" />
                  <span>Call Us {BUSINESS_CONFIG.contact.phoneDisplay}</span>
                </a>
                <Link
                  href="/track-order"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 px-1 text-[13px] font-semibold text-slate-700 hover:text-[#009473]"
                >
                  <MapPin className="w-4 h-4 text-[#009473]" />
                  <span>Track Your Order</span>
                </Link>
                <a
                  href={BUSINESS_CONFIG.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#009473] hover:bg-[#028467] text-white font-semibold text-center py-2.5 rounded-md text-xs transition-colors flex items-center justify-center shadow-sm active:scale-95 duration-150"
                >
                  WhatsApp Support
                </a>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
