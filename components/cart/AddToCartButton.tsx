"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

type AddToCartButtonProps = {
  productId: number;
  inStock: boolean;
  stockCount: number;
  className?: string;
  label?: string;
  quantity?: number;
};

export default function AddToCartButton({
  productId,
  inStock,
  stockCount,
  className = "",
  label = "Add to cart",
  quantity = 1,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const disabled = !inStock || stockCount < 1 || quantity < 1 || quantity > stockCount;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => addItem(productId, quantity, stockCount)}
      className={`flex-grow bg-[#009473] hover:bg-[#028467] hover:scale-[1.02] hover:-translate-y-[1px] active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:transition-none text-white font-semibold text-[13px] py-2.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-150 focus:outline-none cursor-pointer shadow-sm ${className}`}
    >
      <ShoppingCart className="w-4 h-4" />
      <span>{disabled && !inStock ? "Out of Stock" : label}</span>
    </button>
  );
}
