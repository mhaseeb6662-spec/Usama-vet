"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FadeUp } from "@/components/shared/AnimationComponents";
import { useCart } from "@/components/cart/CartProvider";
import type { CartQuote } from "@/lib/services/cartQuote";

const emptyForm = {
  customerName: "",
  phone: "",
  whatsapp: "",
  email: "",
  city: "",
  area: "",
  address: "",
  landmark: "",
  notes: "",
};

export default function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    fetch("/api/account/me")
      .then(async (res) => {
        if (res.status === 401) return null;
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Could not load account details.");
        }
        return data.data;
      })
      .then((customer) => {
        if (!customer) return;
        setAccountName(customer.name || customer.email);
        setForm((prev) => ({
          ...prev,
          customerName: customer.name || prev.customerName,
          phone: customer.phone || prev.phone,
          email: customer.email || prev.email,
          city: customer.city || prev.city,
          area: customer.area || prev.area,
          address: customer.address || prev.address,
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    fetch("/api/cart/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setQuote(data.data);
      })
      .catch((error) => {
        console.error(error);
        setSubmitError("Could not load checkout prices.");
      });
  }, [items]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.customerName.trim().length < 2) next.customerName = "Full name is required.";
    if (!/^((\+92)|(0092)|92|0)?3\d{9}$/.test(form.phone.replace(/[\s-()]/g, ""))) {
      next.phone = "Enter a valid Pakistani mobile number.";
    }
    if (form.whatsapp && !/^((\+92)|(0092)|92|0)?3\d{9}$/.test(form.whatsapp.replace(/[\s-()]/g, ""))) {
      next.whatsapp = "Enter a valid WhatsApp number.";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email.";
    if (form.city.trim().length < 2) next.city = "City is required.";
    if (form.address.trim().length < 8) next.address = "Complete address is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError("");
    if (!validate() || placing) return;
    if (!quote?.canCheckout) {
      setSubmitError("Your cart has items that cannot be ordered.");
      return;
    }

    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentMethod: "COD",
          items,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "We couldn't place your order. Please try again.");
      }
      clearCart();
      router.push(`/order-success/${data.data.orderNumber}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We couldn't place your order. Please try again.");
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
        <Link href="/" className="text-emerald-700 font-semibold">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid lg:grid-cols-12 gap-6">
      <FadeUp className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 md:p-6 space-y-4">
        <h1 className="text-xl font-bold text-slate-900">Shipping Details</h1>
        {accountName ? (
          <p className="text-sm text-emerald-700">Logged in as {accountName}. This order will be saved to your account.</p>
        ) : (
          <p className="text-sm text-slate-500">
            Ordering as guest. <Link href="/account/login?next=/checkout" className="text-emerald-700 font-semibold">Login</Link> to save details and get product updates, or continue without login.
          </p>
        )}
        {[
          ["customerName", "Full Name *", "text"],
          ["phone", "Mobile Number *", "tel"],
          ["whatsapp", "WhatsApp Number", "tel"],
          ["email", "Email", "email"],
          ["city", "City *", "text"],
          ["area", "Area", "text"],
          ["landmark", "Landmark", "text"],
        ].map(([name, label, type]) => (
          <label key={name} className="block text-sm">
            <span className="font-medium text-slate-700">{label}</span>
            <input
              name={name}
              type={type}
              value={form[name as keyof typeof form]}
              onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors[name] && <span className="text-rose-600 text-xs">{errors[name]}</span>}
          </label>
        ))}
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Complete Address *</span>
          <textarea
            value={form.address}
            onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
            rows={3}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.address && <span className="text-rose-600 text-xs">{errors.address}</span>}
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Order Notes</span>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            rows={2}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </label>
        <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name="paymentMethod" value="COD" defaultChecked className="text-emerald-600" />
            <span className="font-semibold text-slate-900">Cash on Delivery (COD)</span>
          </label>
        </div>
      </FadeUp>

      <aside className="lg:col-span-5">
        <FadeUp className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 sticky top-28">
          <h2 className="font-bold text-slate-900">Order Summary</h2>
          {quote?.items.map((item) => (
            <div key={item.productId} className="flex gap-3 text-sm">
              <div className="w-14 h-14 rounded-lg bg-slate-50 overflow-hidden shrink-0">
                {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-contain" /> : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-slate-500">Qty {item.quantity} × Rs. {item.unitPrice.toLocaleString()}</p>
              </div>
              <p className="font-semibold">Rs. {(item.unitPrice * item.quantity).toLocaleString()}</p>
            </div>
          ))}
          <div className="border-t border-slate-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs. {(quote?.subtotal || 0).toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{quote?.shippingFee ? `Rs. ${quote.shippingFee.toLocaleString()}` : "Free"}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>Rs. {(quote?.discount || 0).toLocaleString()}</span></div>
            <div className="flex justify-between font-bold"><span>Grand Total</span><span>Rs. {(quote?.total || 0).toLocaleString()}</span></div>
          </div>
          {submitError && <p className="text-rose-600 text-sm">{submitError}</p>}
          <button
            type="submit"
            disabled={placing || !quote?.canCheckout}
            className="w-full bg-[#009473] hover:bg-[#028467] disabled:opacity-50 text-white font-semibold py-3 rounded-lg"
          >
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </FadeUp>
      </aside>
    </form>
  );
}
