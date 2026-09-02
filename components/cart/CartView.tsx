"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { FadeUp } from "@/components/shared/AnimationComponents";
import { useCart } from "@/components/cart/CartProvider";
import type { CartQuote } from "@/lib/services/cartQuote";

export default function CartView() {
  const { items, setQuantity, removeItem } = useCart();
  const itemsKey = JSON.stringify(items);
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [quoteKey, setQuoteKey] = useState("");
  const [error, setError] = useState("");
  const loading = items.length > 0 && quoteKey !== itemsKey;

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    let cancelled = false;
    fetch("/api/cart/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Could not load cart.");
        }
        if (!cancelled) {
          setQuote(data.data);
          setQuoteKey(itemsKey);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load cart.");
          setQuoteKey(itemsKey);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [items, itemsKey]);

  if (items.length === 0) {
    return (
      <FadeUp className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Your cart is empty</h1>
        <p className="text-slate-500 mb-6">Add veterinary products to continue shopping.</p>
        <Link href="/" className="inline-block bg-[#009473] hover:bg-[#028467] text-white font-semibold px-6 py-3 rounded-lg">
          Continue Shopping
        </Link>
      </FadeUp>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-4">
        {error && <p className="text-rose-600 text-sm">{error}</p>}
        {loading && !quote && <p className="text-slate-500 text-sm">Loading cart...</p>}
        {quote?.items.map((item) => (
          <FadeUp key={item.productId} className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex gap-3 sm:gap-4 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-slate-900 truncate">{item.name}</h2>
              <p className="text-sm text-slate-500">Rs. {item.unitPrice.toLocaleString()}</p>
              {item.error && <p className="text-rose-600 text-xs mt-1">{item.error}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-lg">
                  <button type="button" onClick={() => setQuantity(item.productId, item.quantity - 1, item.stock)} className="w-10 h-10 flex items-center justify-center" aria-label="Decrease quantity">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button type="button" onClick={() => setQuantity(item.productId, item.quantity + 1, item.stock)} className="w-10 h-10 flex items-center justify-center" aria-label="Increase quantity">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button type="button" onClick={() => removeItem(item.productId)} className="text-rose-500 text-sm flex items-center gap-1 min-h-10">
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              </div>
            </div>
            <div className="font-semibold text-slate-900 shrink-0 text-sm sm:text-base">Rs. {(item.unitPrice * item.quantity).toLocaleString()}</div>
          </FadeUp>
        ))}
      </div>
      <aside className="lg:col-span-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3 lg:sticky lg:top-28">
          <h2 className="font-bold text-slate-900">Cart Summary</h2>
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>Rs. {(quote?.subtotal || 0).toLocaleString()}</span></div>
          <div className="flex justify-between text-sm"><span>Shipping</span><span>{quote?.shippingFee ? `Rs. ${quote.shippingFee.toLocaleString()}` : "Free"}</span></div>
          <div className="flex justify-between text-sm"><span>Discount</span><span>Rs. {(quote?.discount || 0).toLocaleString()}</span></div>
          <div className="flex justify-between font-bold border-t border-slate-100 pt-3"><span>Grand Total</span><span>Rs. {(quote?.total || 0).toLocaleString()}</span></div>
          {quote?.canCheckout ? (
            <Link href="/checkout" className="block text-center bg-[#009473] hover:bg-[#028467] text-white font-semibold py-3 min-h-12 rounded-lg">
              Proceed to Checkout
            </Link>
          ) : (
            <p className="text-sm text-rose-600">Fix cart issues before checkout.</p>
          )}
          <Link href="/" className="block text-center text-sm text-emerald-700 font-semibold">Continue Shopping</Link>
        </div>
      </aside>
    </div>
  );
}
