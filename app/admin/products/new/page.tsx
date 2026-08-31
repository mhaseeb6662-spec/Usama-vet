import React from "react";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

async function createProduct(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const shortDescription = formData.get("shortDescription") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stockQuantity = parseInt(formData.get("stockQuantity") as string, 10);
  const categoryId = formData.get("categoryId") as string;
  
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  await prisma.product.create({
    data: {
      name, slug, shortDescription, description, price, stockQuantity, categoryId
    }
  });

  redirect("/admin/products");
}

export default async function NewProductAdmin() {
  const categories = await prisma.category.findMany();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-slate-200 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-slate-600" /></Link>
        <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
        <form action={createProduct} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
              <input name="name" type="text" required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. VitaGlow Supplement" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select name="categoryId" required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price (Rs.)</label>
              <input name="price" type="number" step="0.01" required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
              <input name="stockQuantity" type="number" required defaultValue="10" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
            <input name="shortDescription" type="text" required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Brief summary for product card..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Description</label>
            <textarea name="description" required rows={5} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none resize-y" placeholder="Detailed product information..." />
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
              <Save className="w-4 h-4" /> Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
