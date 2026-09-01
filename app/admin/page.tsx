import React from "react";
import { prisma } from "@/lib/db";
import { 
  ShoppingCart, 
  Package, 
  Users, 
  MessageSquare,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  let totalProducts = 0;
  let totalOrders = 0;
  let pendingOrders = 0;
  let pendingReviews = 0;
  let loadError = "";

  try {
    [totalProducts, totalOrders, pendingOrders, pendingReviews] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.review.count({ where: { status: "PENDING" } }),
    ]);
  } catch (error) {
    console.error("[admin] dashboard stats failed:", error);
    loadError = "Could not load dashboard stats. Please try again.";
  }

  const stats = [
    { title: "Total Products", value: totalProducts, icon: Package, color: "bg-blue-500", link: "/admin/products" },
    { title: "Total Orders", value: totalOrders, icon: ShoppingCart, color: "bg-emerald-500", link: "/admin/orders" },
    { title: "Pending Orders", value: pendingOrders, icon: AlertCircle, color: "bg-amber-500", link: "/admin/orders?status=PENDING" },
    { title: "Pending Reviews", value: pendingReviews, icon: MessageSquare, color: "bg-purple-500", link: "/admin/reviews?status=PENDING" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome to the Usama Vet Admin control panel.</p>
        </div>
      </div>

      {loadError ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600">{loadError}</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Link key={idx} href={stat.link} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center text-${stat.color.replace('bg-', '')}`}>
              <stat.icon className={`w-6 h-6 text-slate-700`} />
            </div>
          </Link>
        ))}
      </div>
      
      {/* Quick Actions or Recent Activity could go here */}
      <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Setup Guide</h2>
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">1</div>
            Create <b>Categories</b> before adding products.
          </li>
          <li className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">2</div>
            Add <b>Products</b> and manage their stock.
          </li>
          <li className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">3</div>
            Approve <b>Reviews</b> submitted by customers.
          </li>
        </ul>
      </div>
    </div>
  );
}
