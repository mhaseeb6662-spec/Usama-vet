import React from "react";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CustomersAdmin() {
  let customers: Array<{
    id: number;
    name: string | null;
    email: string;
    phone: string | null;
    city: string | null;
    createdAt: Date;
  }> = [];
  let loadError = "";

  try {
    customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("[admin] customers list failed:", error);
    loadError = "Could not load customers. Please try again.";
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
      {loadError ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600">{loadError}</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">City</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No customer accounts yet.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{customer.name || "Guest account"}</td>
                    <td className="px-6 py-4 text-slate-600">{customer.email}</td>
                    <td className="px-6 py-4 text-slate-600">{customer.phone || "—"}</td>
                    <td className="px-6 py-4 text-slate-600">{customer.city || "—"}</td>
                    <td className="px-6 py-4 text-slate-600">{customer.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
