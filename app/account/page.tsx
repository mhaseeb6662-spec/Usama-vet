import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAuthenticatedCustomer } from "@/lib/services/customerAuth";
import { getAlertsForCustomer, markAlertsSeen } from "@/lib/services/productAlerts";
import { ensureOrderSchema } from "@/lib/services/orderSchema";
import AccountLogoutButton from "@/components/account/AccountLogoutButton";
import { toServedImageUrl } from "@/lib/mediaUrl";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const user = await getAuthenticatedCustomer();
  if (!user) {
    redirect("/account/login");
  }

  await ensureOrderSchema();
  const [alerts, orders] = await Promise.all([
    getAlertsForCustomer(user),
    prisma.order.findMany({
      where: { customerId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        items: {
          select: { productNameSnapshot: true, quantity: true },
        },
      },
    }),
  ]);
  await markAlertsSeen(user.id);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="max-w-5xl mx-auto px-4 pt-8 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome, {user.name || "Customer"}</h1>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
          <AccountLogoutButton />
        </div>

        <section id="updates" className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Product Updates</h2>
          <p className="text-sm text-slate-500">When we add or update a product, it appears here.</p>
          {alerts.length === 0 ? (
            <p className="text-slate-500 text-sm">No product updates yet.</p>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Link key={alert.id} href={`/products/${alert.productSlug}`} className="flex gap-3 border border-slate-100 rounded-lg p-3 hover:border-emerald-200">
                  <div className="w-14 h-14 rounded-lg bg-slate-50 overflow-hidden shrink-0">
                    {alert.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={toServedImageUrl(alert.image)} alt={alert.productName} className="w-full h-full object-contain" />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-700">{alert.kind === "NEW" ? "New product" : "Product updated"}</p>
                    <p className="font-semibold text-slate-900">{alert.title}</p>
                    <p className="text-xs text-slate-400">{alert.createdAt.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">My Orders</h2>
          {orders.length === 0 ? (
            <p className="text-slate-500 text-sm">No account orders yet. Guest orders can still be checked from Track Your Order.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border border-slate-100 rounded-lg p-3">
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-slate-500">{order.status} · Rs. {Number(order.total).toLocaleString()}</p>
                  <p className="text-xs text-slate-400">{order.items.map((item) => `${item.productNameSnapshot} x${item.quantity}`).join(", ")}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
