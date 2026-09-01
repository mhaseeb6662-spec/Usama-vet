import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ensureOrderSchema } from "@/lib/services/orderSchema";
import OrderActions from "@/components/admin/OrderActions";
import type { OrderStatusValue } from "@/lib/constants/checkout";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await ensureOrderSchema();
  const { id } = await params;
  const orderId = Number.parseInt(id, 10);
  if (Number.isNaN(orderId)) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="text-sm text-emerald-700 font-semibold">Back to orders</Link>
      <h1 className="text-2xl font-bold text-slate-900">{order.orderNumber}</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 text-sm">
          <p><b>Date:</b> {order.createdAt.toLocaleString()}</p>
          <p><b>Customer:</b> {order.customerName}</p>
          <p><b>Phone:</b> {order.phone}</p>
          <p><b>WhatsApp:</b> {order.whatsapp || "-"}</p>
          <p><b>Email:</b> {order.email || "-"}</p>
          <p><b>City:</b> {order.city}</p>
          <p><b>Area:</b> {order.area || "-"}</p>
          <p><b>Address:</b> {order.address}</p>
          <p><b>Landmark:</b> {order.landmark || "-"}</p>
          <p><b>Notes:</b> {order.notes || "-"}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 text-sm">
          <p><b>Subtotal:</b> Rs. {Number(order.subtotal).toLocaleString()}</p>
          <p><b>Shipping:</b> Rs. {Number(order.shippingFee).toLocaleString()}</p>
          <p><b>Discount:</b> Rs. {Number(order.discount).toLocaleString()}</p>
          <p><b>Total:</b> Rs. {Number(order.total).toLocaleString()}</p>
          <p><b>Payment Method:</b> {order.paymentMethod}</p>
          <p><b>Payment Status:</b> {order.paymentStatus}</p>
          <p><b>Order Status:</b> {order.status}</p>
          <div className="pt-3">
            <OrderActions orderId={order.id} status={order.status as OrderStatusValue} paymentStatus={order.paymentStatus || "UNPAID"} />
          </div>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Unit Price</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  {item.imageSnapshot ? <img src={item.imageSnapshot} alt="" className="w-12 h-12 object-contain" /> : "-"}
                </td>
                <td className="px-4 py-3">{item.productNameSnapshot}</td>
                <td className="px-4 py-3">{item.skuSnapshot}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3">Rs. {Number(item.unitPrice).toLocaleString()}</td>
                <td className="px-4 py-3">Rs. {Number(item.totalPrice).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
