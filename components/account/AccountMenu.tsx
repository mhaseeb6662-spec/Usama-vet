"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, User } from "lucide-react";

type CustomerMe = {
  name: string;
  unreadAlerts: number;
};

export default function AccountMenu() {
  const [customer, setCustomer] = useState<CustomerMe | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/account/me")
      .then(async (res) => {
        if (res.status === 401) {
          setCustomer(null);
          return;
        }
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Could not load account.");
        }
        setCustomer({
          name: data.data.name || "Account",
          unreadAlerts: Number(data.data.unreadAlerts || 0),
        });
      })
      .catch((error) => {
        console.error(error);
        setCustomer(null);
      })
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || !customer) {
    return (
      <Link href="/account/login" className="flex items-center gap-2.5 hover:text-[#009473] transition-colors focus:outline-none text-left group">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-550 shrink-0 hover-scale-subtle">
          <User className="w-5 h-5" />
        </div>
        <span className="hidden lg:inline text-[15px] font-semibold text-slate-700 group-hover:text-[#009473] transition-colors">
          Login / Register
        </span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1 sm:gap-3">
      <Link href="/account#updates" className="relative hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white items-center justify-center hover:text-[#009473]" aria-label="Product updates">
        <Bell className="w-5 h-5" />
        {customer.unreadAlerts > 0 ? (
          <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-[#009473] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {customer.unreadAlerts}
          </span>
        ) : null}
      </Link>
      <Link href="/account" className="flex items-center gap-2.5 hover:text-[#009473] transition-colors focus:outline-none text-left group">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-550 shrink-0 hover-scale-subtle">
          <User className="w-5 h-5" />
        </div>
        <span className="hidden lg:inline text-[15px] font-semibold text-slate-700 group-hover:text-[#009473] transition-colors max-w-[120px] truncate">
          {customer.name}
        </span>
      </Link>
    </div>
  );
}
