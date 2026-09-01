import React from "react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";

export default function SettingsAdmin() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Store Settings</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Store name</p>
          <p className="text-slate-900 font-medium">{BUSINESS_CONFIG.name}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Website</p>
          <p className="text-slate-900 font-medium">{BUSINESS_CONFIG.url}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Phone</p>
          <p className="text-slate-900 font-medium">{BUSINESS_CONFIG.contact.phoneDisplay}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">WhatsApp</p>
          <p className="text-slate-900 font-medium">{BUSINESS_CONFIG.contact.whatsappDisplay}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Email</p>
          <p className="text-slate-900 font-medium">{BUSINESS_CONFIG.contact.email}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Address</p>
          <p className="text-slate-900 font-medium">{BUSINESS_CONFIG.contact.address}</p>
        </div>
      </div>
    </div>
  );
}
