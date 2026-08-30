import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Clock, Sparkles, Stethoscope, ArrowRight, ArrowUpRight, MessageSquare, Award } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { MOCK_CATEGORIES, MOCK_PRODUCTS, DEMO_REVIEWS } from "@/lib/data/mockData";
import CategoryCard from "@/components/home/CategoryCard";
import ProductCard from "@/components/product/ProductCard";
import ReviewCard from "@/components/reviews/ReviewCard";
import { OrganizationSchema, WebSiteSchema } from "@/lib/seo/schema";

export default function HomePage() {
  // Grab the first 3 products for featured display
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);
  // Grab the first 3 reviews for preview
  const previewReviews = DEMO_REVIEWS.slice(0, 3);

  return (
    <div className="relative">
      {/* SEO Schema Scripts */}
      <OrganizationSchema />
      <WebSiteSchema />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white py-20 px-4 overflow-hidden">
        {/* Decorative Grid Overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Stethoscope className="w-3.5 h-3.5" /> Direct Veterinary Pharmacy & Supplies
            </span>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-white">
              Trusted Healthcare Products For <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Livestock, Farms & Pets</span>
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Sourcing authentic veterinary medicines, nutritional supplements, and animal care essentials directly from certified manufacturers. Ensure the wellness and productivity of your animals with Usama Vet.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <Link
                href="#products"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-emerald-600/15 transition-all text-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Shop Products <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="border border-slate-700 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-600 text-slate-200 font-semibold px-6 py-3 rounded-lg transition-all text-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Trust Panel */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl" />
              
              <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Award className="w-5 h-5 text-emerald-400" /> Professional Sourcing Standard
              </h3>

              <div className="space-y-4 relative z-10">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white uppercase tracking-wider mb-0.5">100% Certified Potency</span>
                    <span className="block text-xs text-slate-400 leading-normal">Medicines stored under strict temperature guidelines.</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Truck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white uppercase tracking-wider mb-0.5">Safe Cold-Chain Delivery</span>
                    <span className="block text-xs text-slate-400 leading-normal">Ensuring sensitive vaccines and injectables remain safe.</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white uppercase tracking-wider mb-0.5">24/7 Veterinary Support</span>
                    <span className="block text-xs text-slate-400 leading-normal">Consult our technical team for dosage and administration.</span>
                  </div>
                </div>
              </div>

              {/* Livestock stats bar */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-slate-800 text-center">
                <div>
                  <span className="block text-xl font-extrabold text-emerald-400 leading-none">150+</span>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Verified Brands</span>
                </div>
                <div>
                  <span className="block text-xl font-extrabold text-emerald-400 leading-none">10k+</span>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Farms Served</span>
                </div>
                <div>
                  <span className="block text-xl font-extrabold text-emerald-400 leading-none">100%</span>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Genuine Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST/BENEFITS STRIP */}
      <section className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {BUSINESS_CONFIG.features.map((feature, i) => (
            <div key={i} className="flex gap-3 items-start p-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                {i === 0 && <ShieldCheck className="w-5 h-5" />}
                {i === 1 && <Stethoscope className="w-5 h-5" />}
                {i === 2 && <Truck className="w-5 h-5" />}
                {i === 3 && <Clock className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-0.5">
                  {feature.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED CATEGORIES SECTION */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Categories
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Browse Our Veterinary Solutions
          </h2>
          <div className="w-12 h-1 bg-emerald-600 mx-auto mt-3 rounded-full" />
          <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
            Choose specialized products according to your animal needs. Sourced under veterinary guidance to assure maximum safety.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {MOCK_CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS PLACEHOLDER SECTION */}
      <section id="products" className="bg-slate-100/60 border-t border-b border-slate-200 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 mb-10 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                Our Showcase
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Featured Veterinary Products
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
                Authentic formulations and feed premixes ready for nationwide distribution. Subject to veterinary consultation where applicable.
              </p>
            </div>
            <Link
              href="/#products"
              className="inline-flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-emerald-600 hover:text-emerald-700 hover:underline shrink-0"
            >
              Browse All Products <ArrowUpRight className="w-4.5 h-4.5" />
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-16 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left column: Image placeholder styled with Tailwind */}
        <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl aspect-video sm:aspect-auto sm:h-96 flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 opacity-90" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10" />
          
          <div className="relative z-10">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded">
              Verification Standards
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-4 max-w-md leading-snug">
              Every Batch Tested. Every Compound Checked.
            </h3>
            <p className="text-xs text-slate-300 mt-2 max-w-md leading-relaxed">
              We understand that animal health directly impacts farm yields and family companionship. That is why we refuse to compromise on sourcing authenticity.
            </p>
          </div>

          <div className="relative z-10 flex gap-6 mt-8">
            <div>
              <span className="block text-2xl font-extrabold text-emerald-400">100%</span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Cold Chain Storage</span>
            </div>
            <div className="border-l border-slate-800" />
            <div>
              <span className="block text-2xl font-extrabold text-emerald-400">GMP</span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Approved Brands Only</span>
            </div>
          </div>
        </div>

        {/* Right column: Content */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Value Proposition
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Professional Sourcing & Dedicated Support
            </h2>
            <div className="w-12 h-1 bg-emerald-600 mt-3 rounded-full" />
          </div>

          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Usama Vet Care serves as a key bridge between global animal health pharmaceutical providers and livestock owners, veterinarians, and pet keepers in Pakistan.
          </p>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                <span className="text-xs font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Genuine & Sourced Medicines</h4>
                <p className="text-xs text-slate-500 mt-0.5">We buy directly from companies or authorized distributors. No counterfeit risks.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                <span className="text-xs font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Cold Chain Logistics for Vaccines</h4>
                <p className="text-xs text-slate-500 mt-0.5">Sensitive vaccines are shipped under strict temperature control utilizing thermal packs.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                <span className="text-xs font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Expert Dosage Consultation</h4>
                <p className="text-xs text-slate-500 mt-0.5">Our support desk helps you configure correct dosage charts based on animal body weight.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS PREVIEW SECTION */}
      <section className="bg-slate-100/60 border-t border-b border-slate-200 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              What Farmers & Vets Say
            </h2>
            <div className="w-12 h-1 bg-emerald-600 mx-auto mt-3 rounded-full" />
            <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
              Discover how Usama Vet Care is improving herd productivity and pet wellness. Review data shown is for demonstration of customer feedback architecture.
            </p>
          </div>

          {/* Testimonial grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:border-emerald-500 font-bold text-xs uppercase tracking-wider text-slate-700 hover:text-emerald-700 px-5 py-2.5 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" /> View All Customer Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="bg-slate-950 text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#047857_0%,transparent_40%)] opacity-30" />
        
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Safeguard Your Animal Health?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Order authentic livestock medications, poultry vitamin premixes, and pet care sprays today. We package securely and ship direct to your doorstep.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link
              href="#products"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition-all text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Order Online Now
            </Link>
            <a
              href={BUSINESS_CONFIG.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-emerald-400 font-bold px-6 py-3 rounded-lg transition-all text-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
