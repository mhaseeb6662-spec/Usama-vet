"use client";

import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default function ProductAddToCart({
  productId,
  stockCount,
}: {
  productId: number;
  stockCount: number;
}) {
  const inStock = stockCount > 0;
  const [quantity, setQuantity] = useState(1);
  const safeQty = Math.min(Math.max(quantity, 1), Math.max(stockCount, 1));

  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
        <button
          type="button"
          disabled={!inStock || safeQty <= 1}
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          className="w-10 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          min={1}
          max={stockCount}
          value={safeQty}
          disabled={!inStock}
          onChange={(event) => {
            const next = Number.parseInt(event.target.value, 10);
            if (Number.isNaN(next)) return;
            setQuantity(Math.min(Math.max(next, 1), stockCount));
          }}
          className="w-14 h-11 text-center text-sm font-semibold outline-none"
        />
        <button
          type="button"
          disabled={!inStock || safeQty >= stockCount}
          onClick={() => setQuantity((value) => Math.min(stockCount, value + 1))}
          className="w-10 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <AddToCartButton
        productId={productId}
        inStock={inStock}
        stockCount={stockCount}
        quantity={safeQty}
        label="Add to Cart"
        className="w-full sm:w-auto sm:min-w-[200px] rounded-lg text-sm py-3"
      />
    </div>
  );
}
