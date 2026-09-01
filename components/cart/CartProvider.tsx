"use client";

import React, { createContext, useContext, useMemo, useState, useSyncExternalStore } from "react";
import {
  getCartSnapshot,
  getServerCartSnapshot,
  parseCart,
  subscribeCart,
  writeCart,
  type StoredCartItem,
} from "@/lib/cart/storage";

type CartContextValue = {
  items: StoredCartItem[];
  count: number;
  addItem: (productId: number, quantity?: number, maxStock?: number) => void;
  setQuantity: (productId: number, quantity: number, maxStock?: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  message: string;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerCartSnapshot);
  const items = parseCart(raw);
  const [message, setMessage] = useState("");

  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2500);
  };

  const update = (next: StoredCartItem[]) => {
    writeCart(next);
  };

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    addItem: (productId, quantity = 1, maxStock) => {
      const existing = items.find((item) => item.productId === productId);
      const nextQty = (existing?.quantity || 0) + quantity;
      const capped = maxStock != null ? Math.min(nextQty, maxStock) : nextQty;
      if (capped < 1) return;
      if (existing) {
        update(items.map((item) => (item.productId === productId ? { ...item, quantity: capped } : item)));
      } else {
        update([...items, { productId, quantity: capped }]);
      }
      showMessage("Product added to cart");
    },
    setQuantity: (productId, quantity, maxStock) => {
      update(
        items
          .map((item) => {
            if (item.productId !== productId) return item;
            const next = maxStock != null ? Math.min(quantity, maxStock) : quantity;
            return { ...item, quantity: Math.max(1, next) };
          })
          .filter((item) => item.quantity >= 1)
      );
    },
    removeItem: (productId) => {
      update(items.filter((item) => item.productId !== productId));
    },
    clearCart: () => update([]),
    message,
  }), [items, message]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {message && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {message}
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }
  return context;
}
