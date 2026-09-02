import React from "react";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import AdminActionError from "@/components/admin/AdminActionError";
import { deleteProductAlertsForProduct } from "@/lib/services/productAlerts";
import { runAdminAction } from "@/lib/admin/mutation";

async function loadProductList() {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

async function deleteProduct(formData: FormData) {
  "use server";
  await runAdminAction("/admin/products", async () => {
    const id = Number.parseInt(String(formData.get("id") || ""), 10);
    if (Number.isNaN(id)) {
      throw new Error("Product id is required to delete.");
    }
    const existing = await prisma.product.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      throw new Error("Product was not found.");
    }
    await deleteProductAlertsForProduct(id);
    await prisma.product.delete({ where: { id } });
  });
}

export default async function ProductsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  let products: Awaited<ReturnType<typeof loadProductList>> = [];
  let loadError = "";
  try {
    products = await loadProductList();
  } catch (error) {
    console.error("[admin] product list failed:", error);
    loadError = "Could not load products. Please try again.";
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Manage Products</h1>
        <Link href="/admin/products/new" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>
      <AdminActionError message={params.error || loadError} />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-semibold">Product Name</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">Stock</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No products found.</td></tr>
            ) : products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                <td className="px-6 py-4 text-slate-500">{product.category?.name || "Uncategorized"}</td>
                <td className="px-6 py-4 text-slate-900 font-medium">Rs. {product.price.toString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${product.stockQuantity > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${product.id}`} title="Edit" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button type="submit" title="Delete" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
