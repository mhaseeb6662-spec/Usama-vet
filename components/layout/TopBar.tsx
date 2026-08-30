import React from "react";
import Link from "next/link";
import { Truck, Heart, RefreshCw, ClipboardList } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-emerald-800 text-white text-[11px] py-2.5 px-4 font-medium border-b border-emerald-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Side: Welcome Promo */}
        <div className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-emerald-300" />
          <span>Welcome to Usama Vet Care! Get free delivery on orders over PKR 5,000.</span>
        </div>

        {/* Right Side: Links */}
        <div className="hidden sm:flex items-center gap-4 text-emerald-100">
          <Link href="/order-tracking" className="hover:text-white flex items-center gap-1 transition-colors">
            <ClipboardList className="w-3 h-3" /> Track Order
          </Link>
          <span className="text-emerald-700">|</span>
          <Link href="/wishlist" className="hover:text-white flex items-center gap-1 transition-colors">
            <Heart className="w-3 h-3" /> Wishlist
          </Link>
          <span className="text-emerald-700">|</span>
          <Link href="/compare" className="hover:text-white flex items-center gap-1 transition-colors">
            <RefreshCw className="w-3 h-3" /> Compare
          </Link>
        </div>
      </div>
    </div>
  );
}
