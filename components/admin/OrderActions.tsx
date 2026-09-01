"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ALLOWED_STATUS_TRANSITIONS, ORDER_PAYMENT_STATUSES, type OrderStatusValue } from "@/lib/constants/checkout";

export default function OrderActions({
  orderId,
  status,
  paymentStatus,
}: {
  orderId: number;
  status: OrderStatusValue;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const nextStatuses = ALLOWED_STATUS_TRANSITIONS[status];

  const updateStatus = async (next: string) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Status update failed.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed.");
    } finally {
      setSaving(false);
    }
  };

  const updatePayment = async (next: string) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: next }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Payment update failed.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold mb-2">Order Status</p>
        <div className="flex flex-wrap gap-2">
          {nextStatuses.map((value) => (
            <button key={value} type="button" disabled={saving} onClick={() => updateStatus(value)} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-semibold disabled:opacity-50">
              Mark {value}
            </button>
          ))}
          {nextStatuses.length === 0 && <p className="text-sm text-slate-500">No further status changes.</p>}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold mb-2">Payment Status ({paymentStatus})</p>
        <div className="flex flex-wrap gap-2">
          {ORDER_PAYMENT_STATUSES.map((value) => (
            <button key={value} type="button" disabled={saving || paymentStatus === value} onClick={() => updatePayment(value)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold disabled:opacity-50">
              {value}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-rose-600 text-sm">{error}</p>}
    </div>
  );
}
