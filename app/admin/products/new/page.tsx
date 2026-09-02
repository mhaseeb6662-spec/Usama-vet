import React from "react";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ui/ImageUploader";
import AdminActionError from "@/components/admin/AdminActionError";
import { runAdminAction } from "@/lib/admin/mutation";
import { createAdminProduct } from "@/lib/services/adminProduct";

async function createProduct(formData: FormData) {
  "use server";
  await runAdminAction("/admin/products/new", async () => {
    await createAdminProduct(formData);
    redirect("/admin/products");
  });
}

export default async function NewProductAdmin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  let categories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];
  let loadError = "";
  try {
    categories = await prisma.category.findMany();
  } catch (error) {
    console.error("[admin] product categories failed:", error);
    loadError = "Could not load categories. Please try again.";
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-slate-200 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-slate-600" /></Link>
        <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
      </div>
      <AdminActionError message={params.error || loadError} />

      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
        <form action={createProduct} className="space-y-8">
          
          {/* BASIC INFORMATION */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Primary Image</label>
                <ImageUploader name="primaryImage" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input name="name" type="text" required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. VitaGlow Supplement" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                <input name="sku" type="text" required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. VITA-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select name="categoryId" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* PRICING & INVENTORY */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Pricing & Inventory</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Regular Price (Rs.)</label>
                <input name="price" type="number" step="0.01" required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sale Price (Rs.) (Optional)</label>
                <input name="salePrice" type="number" step="0.01" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                <input name="stockQuantity" type="number" required defaultValue="10" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
                <input name="shortDescription" type="text" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Brief summary for product card..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Description</label>
                <textarea name="description" rows={5} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none resize-y" placeholder="Detailed product information..." />
              </div>
            </div>
          </div>

          {/* HOMEPAGE VISIBILITY */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Homepage Visibility Sections</h2>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isFeatured" className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isNewArrival" defaultChecked className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-slate-700">New Arrival</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isBestSeller" className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Best Seller</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isRecommended" className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Recommended</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isTrending" className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Trending</span>
              </label>
            </div>
          </div>

          {/* SEO */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">SEO (Search Engine Optimization)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SEO Title (Optional)</label>
                <input name="seoTitle" type="text" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Leave blank to use product name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description (Optional)</label>
                <textarea name="metaDescription" rows={2} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Leave blank to use short description" />
              </div>
            </div>
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


