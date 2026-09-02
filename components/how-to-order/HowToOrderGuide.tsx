import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { FACEBOOK_ORDER_POST, HOW_TO_ORDER_STEPS } from "@/lib/constants/howToOrder";
import CopyOrderPostButton from "./CopyOrderPostButton";

export default function HowToOrderGuide() {
  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
        <p className="text-emerald-700 font-semibold text-sm uppercase tracking-wide">Usamavet & Surgical</p>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
          How to complete an order
        </h1>
        <p className="text-slate-600 mt-3">
          Order veterinary medicines, livestock products, poultry supplements, and pet care from
          Gujranwala with Cash on Delivery. Login is not required.
        </p>
        <p className="text-slate-500 mt-2 text-sm">
          Veterinary medicines, livestock aur pet care ka order website se guest ki tarah ho sakta hai.
          Payment Cash on Delivery hai.
        </p>
        <div className="flex flex-wrap gap-3 mt-5">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-[#009473] hover:bg-[#028467] text-white font-semibold px-5 py-2.5 rounded-lg text-sm"
          >
            Shop now
          </Link>
          <Link
            href="/track-order"
            className="inline-flex items-center justify-center border border-emerald-200 text-emerald-800 font-semibold px-5 py-2.5 rounded-lg text-sm"
          >
            Track an order
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <h2 className="font-bold text-slate-900">Website order</h2>
          <p className="text-sm text-slate-600 mt-2">
            Browse, add to cart, checkout, and pay cash when the parcel arrives.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="font-bold text-slate-900">WhatsApp / call order</h2>
          <p className="text-sm text-slate-600 mt-2">
            Send your name, city, area, and product to {BUSINESS_CONFIG.contact.phoneDisplay}.
          </p>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="font-bold text-slate-900 mb-4">Step-by-step website order</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {HOW_TO_ORDER_STEPS.map((step) => (
            <div key={step.title} className="border border-slate-100 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900">{step.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{step.en}</p>
              <p className="text-sm text-slate-500 mt-1">{step.ur}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 text-sm">
        <h2 className="font-bold text-slate-900 text-base">After you place the order</h2>
        <p className="text-slate-600">1. Order received — aap ka order receive ho jata hai.</p>
        <p className="text-slate-600">2. Confirmation — team order verify karne ke liye rabta kar sakti hai.</p>
        <p className="text-slate-600">3. Dispatch — confirmation ke baad parcel tayar karke bheja jata hai.</p>
        <p className="text-slate-600">4. Delivery — address par deliver; Cash on Delivery us waqt.</p>
      </section>

      <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
        <h2 className="font-bold text-slate-900 mb-2">Need help?</h2>
        <p className="text-sm text-slate-600 mb-3">
          {BUSINESS_CONFIG.contact.address}. {BUSINESS_CONFIG.hours[0].days}: {BUSINESS_CONFIG.hours[0].time}.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={`tel:${BUSINESS_CONFIG.contact.phone}`}
            className="inline-flex items-center gap-2 bg-white border border-emerald-200 rounded-lg px-4 py-2 font-semibold text-emerald-700"
          >
            <Phone className="w-4 h-4" /> {BUSINESS_CONFIG.contact.phoneDisplay}
          </a>
          <a
            href={BUSINESS_CONFIG.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#009473] text-white rounded-lg px-4 py-2 font-semibold"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-slate-900">Facebook / WhatsApp post</h2>
        <p className="text-sm text-slate-600">
          Copy this text and paste it on Facebook, Instagram, or WhatsApp Status.
        </p>
        <pre className="whitespace-pre-wrap text-sm text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-4">
          {FACEBOOK_ORDER_POST}
        </pre>
        <CopyOrderPostButton />
      </section>
    </div>
  );
}
