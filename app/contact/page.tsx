import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import ContactForm from "@/components/contact/ContactForm";
import { BreadcrumbsSchema } from "@/lib/seo/schema";

export const metadata = {
  title: "Contact Us",
  description: `Get in touch with ${BUSINESS_CONFIG.name}. Contact details, location map, hours of operation, and an interactive form for veterinary inquiries and medicine orders.`,
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Contact Us", item: "/contact" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Breadcrumb Schema */}
      <BreadcrumbsSchema items={breadcrumbs} />

      {/* PAGE HERO */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <nav className="flex justify-center text-[12px] uppercase font-semibold text-emerald-400 gap-2 mb-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Contact Us</span>
          </nav>
          <h1 className="text-[24px] sm:text-[30px] font-bold leading-snug">
            Contact Usama Vet Care
          </h1>
          <p className="text-slate-300 text-[13px] sm:text-[14px] max-w-xl mx-auto leading-normal font-normal">
            Have questions regarding veterinary products, prescription verification, or delivery times? Send us a message or call directly.
          </p>
        </div>
      </section>

      {/* MAIN LAYOUT: Form + Contact Info */}
      <section className="max-w-6xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Columns: Interactive Form */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        {/* Right Columns: Info details & Maps */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Help Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-slate-900 font-semibold text-[13px] sm:text-[14px] uppercase border-b border-slate-100 pb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" /> Helpline Directory
            </h3>

            <div className="space-y-4 text-[12px] sm:text-[13px]">
              {/* Phone contact */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-semibold text-slate-700">Call/SMS Support</span>
                  <a href={`tel:${BUSINESS_CONFIG.contact.phone}`} className="text-emerald-700 font-medium hover:underline block mt-0.5">
                    {BUSINESS_CONFIG.contact.phoneDisplay}
                  </a>
                </div>
              </div>

              {/* WhatsApp Live */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-650 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-semibold text-slate-700">WhatsApp Helpline</span>
                  <a
                    href={BUSINESS_CONFIG.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-medium hover:underline block mt-0.5"
                  >
                    {BUSINESS_CONFIG.contact.whatsappDisplay} (Fast Response)
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-semibold text-slate-700">Official Email</span>
                  <a href={`mailto:${BUSINESS_CONFIG.contact.email}`} className="text-slate-600 hover:text-emerald-600 hover:underline block mt-0.5 font-normal">
                    {BUSINESS_CONFIG.contact.email}
                  </a>
                </div>
              </div>

              {/* Physical Address */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-semibold text-slate-700">Store & Clinic Address</span>
                  <span className="text-slate-500 block leading-normal mt-0.5 font-normal">
                    {BUSINESS_CONFIG.contact.address}
                  </span>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-semibold text-slate-700">Operating Hours</span>
                  <div className="text-slate-500 mt-0.5 space-y-0.5 font-normal">
                    {BUSINESS_CONFIG.hours.map((h, index) => (
                      <div key={index}>
                        <span className="font-medium text-slate-600">{h.days}:</span> {h.time}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Google Map Placeholder */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm aspect-video sm:aspect-auto sm:h-64 relative">
            <iframe
              src={BUSINESS_CONFIG.contact.mapEmbeddedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Usama Vet Location Map"
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
