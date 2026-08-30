import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, Award, ArrowRight, Layers, Target, Compass } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { BreadcrumbsSchema } from "@/lib/seo/schema";

export const metadata = {
  title: "About Us",
  description: `Learn more about ${BUSINESS_CONFIG.name}. Our mission, vision, core values, and our commitment to sourcing genuine, veterinarian-approved animal healthcare products.`,
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "About Us", item: "/about" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumb Schema */}
      <BreadcrumbsSchema items={breadcrumbs} />

      {/* PAGE HERO */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <nav className="flex justify-center text-xs uppercase tracking-wider font-semibold text-emerald-400 gap-2 mb-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-slate-300">About Us</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            About Usama Vet Care
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-light">
            Dedicated to providing authentic veterinary solutions, medicines, and nutrition for livestock breeders, poultry farms, and pet keepers across the nation.
          </p>
        </div>
      </section>

      {/* CORE INTRODUCTION SECTION */}
      <section className="py-16 px-4 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Providing Reliable Animal Health Solutions
          </h2>
          <div className="w-12 h-0.5 bg-emerald-600 rounded-full" />
          <p className="text-xs text-slate-600 leading-relaxed">
            {BUSINESS_CONFIG.name} was established with a focus on solving a major challenge in the veterinary sector: sourcing authentic and temperature-maintained veterinary pharmaceuticals. We serve as a direct bridge between licensed global manufacturers and local animal care providers.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Whether managing a commercial dairy farm, maintaining biosecurity in poultry sheds, or ensuring the health of companion pets, our platform provides access to verified formulations, vaccines, bypass fats, and grooming supplies, backed by professional product guidance.
          </p>
        </div>
        <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-3">Our Core Guarantee</h3>
          <ul className="space-y-3 text-xs text-slate-650">
            <li className="flex gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>100% Genuine batch-coded products.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>Cold-chain storage integrity for vaccines.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>Secure packing with rapid shipping.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>Dosage configuration assistance from experts.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="bg-slate-100/60 border-t border-b border-slate-200 py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-5.5 h-5.5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Our Mission</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              To support the dairy and livestock sectors of Pakistan by distributing premium-grade veterinary pharmaceutical supplies and feeds. We aim to protect animal welfare and enhance farm productivity through accessibility, affordability, and supply chain transparency.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Compass className="w-5.5 h-5.5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Our Vision</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              To become Pakistan&apos;s most trusted digital gateway for veterinary products, recognized for strict cold-chain compliance, absolute product authenticity, and professional customer-centric support.
            </p>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Principles
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Our Core Values
          </h2>
          <div className="w-10 h-0.5 bg-emerald-600 mx-auto mt-2 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Authenticity Guarantee</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We never supply unchecked third-party stocks. Every injectable, drench, and feed enhancer is procured directly from licensed manufacturers.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Animal Welfare First</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We stand against improper usage of animal health products. We advocate for responsible dosage regimens to prevent antibiotic resistance.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Quality Compliance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              From temperature-controlled storage racks to shock-resistant shipping crates, we follow global guidelines to preserve compound integrity.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="bg-slate-950 text-white py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">Have Questions About Our Sourcing?</h2>
          <p className="text-xs text-slate-400">
            Reach out to our customer care desk to verify manufacturer certifications, check batch expiry details, or request custom farm quotes.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link
              href="/contact"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow transition-colors"
            >
              Contact Our Desk
            </Link>
            <Link
              href="/#products"
              className="border border-slate-700 hover:bg-slate-900 text-slate-300 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1"
            >
              Browse Products <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
