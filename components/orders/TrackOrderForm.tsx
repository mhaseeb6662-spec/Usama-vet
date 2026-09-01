"use client";

import React, { FormEvent, useState } from "react";
import { TRACKING_STEPS } from "@/lib/constants/checkout";

type TrackedOrder = {
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  paymentMethod: string | null;
  items: { name: string; quantity: number; unitPrice: number; totalPrice: number }[];
};

export default function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "No order found.");
      }
      setOrder(data.data);
    } catch (err) {
      setOrder(null);
      setError(err instanceof Error ? err.message : "Could not look up that order.");
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = TRACKING_STEPS.findIndex((step) => step.status === order?.status);

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Order Number</span>
          <input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="ORD-20260901-000123" required />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Phone Number</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="03001234567" required />
        </label>
        {error && <p className="text-rose-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-[#009473] hover:bg-[#028467] text-white font-semibold py-3 rounded-lg disabled:opacity-50">
          {loading ? "Checking..." : "Track Order"}
        </button>
      </form>

      {order && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <p className="font-bold">Order Number: {order.orderNumber}</p>
          <p className="text-sm text-slate-600">Created: {new Date(order.createdAt).toLocaleString()}</p>
          <p className="text-sm font-semibold">Current Status: {order.status}</p>
          {order.status === "CANCELLED" ? (
            <p className="text-rose-600 font-semibold">This order is cancelled.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {TRACKING_STEPS.map((step, index) => (
                <div key={step.status} className={`rounded-lg px-2 py-3 text-center text-xs font-semibold ${index <= currentIndex ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-400"}`}>
                  {step.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
