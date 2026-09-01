import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ensureOrderSchema } from "@/lib/services/orderSchema";
import { ORDER_STATUSES, type OrderStatusValue } from "@/lib/constants/checkout";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await ensureOrderSchema();
  const params = await searchParams;
  const status = ORDER_STATUSES.find((value): value is OrderStatusValue => value === params.status);
  const q = params.q?.trim() || "";

  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { orderNumber: { contains: q } },
              { customerName: { contains: q } },
              { phone: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
      </div>

      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Search order, name, phone" className="border border-slate-300 rounded-lg px-3 py-2 text-sm min-w-[220px]" />
        <select name="status" defaultValue={status || ""} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All</option>
          {ORDER_STATUSES.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Filter</button>
      </form>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Order Number</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-500">No orders found.</td></tr>
            ) : orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-semibold">{order.orderNumber}</td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3">{order.phone}</td>
                <td className="px-4 py-3">{order.city}</td>
                <td className="px-4 py-3">Rs. {Number(order.total).toLocaleString()}</td>
                <td className="px-4 py-3">{order.paymentMethod} / {order.paymentStatus}</td>
                <td className="px-4 py-3">{order.status}</td>
                <td className="px-4 py-3">{order.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-3"><Link href={`/admin/orders/${order.id}`} className="text-emerald-700 font-semibold">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
