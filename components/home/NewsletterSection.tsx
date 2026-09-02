"use client";

import React, { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimationComponents";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail("");
    }, 1200);
  };

  return (
    <section className="bg-slate-100 border-t border-b border-slate-200 py-8 sm:py-12 px-3 sm:px-4 overflow-hidden">
      <StaggerContainer staggerDelay={0.06} className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left Side: Call to action */}
        <StaggerItem distance={12}>
          <div className="text-center md:text-left space-y-1 max-w-md">
            <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-900 uppercase flex items-center justify-center md:justify-start gap-1.5">
              <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Get the Latest Updates</span>
            </h3>
            <p className="text-[12px] sm:text-[13px] text-slate-500 leading-normal font-normal">
              Subscribe to our newsletter to receive availability updates on critical veterinary medicines and farm supplies.
            </p>
          </div>
        </StaggerItem>

        {/* Right Side: Form and Socials */}
        <StaggerItem distance={12} className="w-full max-w-md">
          <div className="space-y-4">
            {subscribed ? (
              <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 text-[13px] px-4 py-3 rounded-lg text-center font-semibold">
                Subscribed successfully! Thank you for staying updated.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 shadow-sm rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-600 transition-all duration-200">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full min-w-0 bg-white border border-slate-300 rounded-lg sm:rounded-l-lg sm:rounded-r-none py-3 px-4 text-base sm:text-[13px] text-slate-855 focus:outline-none focus:border-emerald-500 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-[13px] uppercase px-5 py-3 rounded-lg sm:rounded-r-lg sm:rounded-l-none transition-colors shrink-0 focus:outline-none active:scale-[0.96] duration-150 min-h-12"
                >
                  {loading ? "..." : "Subscribe"}
                </button>
              </form>
            )}

            {/* Social Links Row */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Connect:</span>
              <a
                href={BUSINESS_CONFIG.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-emerald-600 transition-all hover:scale-[1.08] active:scale-[0.93] duration-150 flex items-center justify-center"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href={BUSINESS_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-emerald-600 transition-all hover:scale-[1.08] active:scale-[0.93] duration-150 flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.008 3.74.052 1.455.067 2.25.3 2.77.5.69.27 1.18.59 1.7 1.1.51.52.83 1.01 1.1 1.7.2.52.43 1.316.5 2.77.045.955.052 1.31.052 3.74 0 2.43-.008 2.784-.052 3.74-.067 1.455-.3 2.25-.5 2.77-.27.69-.59 1.18-1.1 1.7-.52.51-1.01.83-1.7 1.1-.52.2-1.316.43-2.77.5-.955.045-1.31.052-3.74.052-2.43 0-2.784-.008-3.74-.052-1.455-.067-2.25-.3-2.77-.5-.69-.27-1.18-.59-1.7-1.1-.51-.52-.83-1.01-1.1-1.7-.2-.52-.43-1.316-.5-2.77-.045-.955-.052-1.31-.052-3.74 0-2.43.008-2.784.052-3.74.067-1.455.3-2.25.5-2.77.27-.69.59-1.18 1.1-1.7.52-.51 1.01-.83 1.7-1.1.52-.2 1.316-.43 2.77-.5.955-.045 1.31-.052 3.74-.052zm.5 1.977c-2.408 0-2.714.01-3.66.053-.94.043-1.448.2-1.8.34-.467.18-.8.4-1.15.75-.35.35-.57.683-.75 1.15-.14.353-.3.86-.34 1.8-.043.947-.053 1.253-.053 3.66 0 2.407.01 2.714.053 3.66.043.94.2 1.448.34 1.8.18.467.4.8.75 1.15.35.35.683.57 1.15.75.353.14.86.3 1.8.34.947.043 1.253.053 3.66.053 2.407 0 2.714-.01 3.66-.053.94-.043 1.448-.2 1.8-.34.467-.18.8-.4 1.15-.75.35-.35.57-.683.75-1.15.14-.353.3-.86.34-1.8.043-.947.053-1.253.053-3.66 0-2.407-.01-2.714-.053-3.66-.043-.94-.2-1.448-.34-1.8-.18-.467-.4-.8-.75-1.15-.35-.35-.683-.57-1.15-.75-.353-.14-.86-.3-1.8-.34-.947-.043-1.253-.053-3.66-.053zm0 3.333a4.69 4.69 0 100 9.38 4.69 4.69 0 000-9.38zm0 7.403a2.713 2.713 0 110-5.426 2.713 2.713 0 010 5.426zm5.27-7.902a1.08 1.08 0 11-2.16 0 1.08 1.08 0 012.16 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href={BUSINESS_CONFIG.socials.whatsappDirect}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-emerald-650 transition-all hover:scale-[1.08] active:scale-[0.93] duration-150 flex items-center justify-center"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
}
