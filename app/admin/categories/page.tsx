import React from "react";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Plus, Trash2, Edit } from "lucide-react";

async function addCategory(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  
  if (!name) return;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  try {
    await prisma.category.create({
      data: { name, slug, description, isActive: true },
    });
    revalidatePath("/admin/categories");
  } catch (error) {
    console.error("Error creating category:", error);
  }
}

async function deleteCategory(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

export default async function CategoriesAdmin() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Manage Categories</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Add New Category</h2>
          <form action={addCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input name="name" type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Pet Food" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
              <textarea name="description" rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Category details..." />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" /> Save Category
            </button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Category Name</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold">Products</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No categories found.</td>
                </tr>
              ) : categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                  <td className="px-6 py-4 text-slate-500">{cat.slug}</td>
                  <td className="px-6 py-4 text-slate-500">{cat._count.products}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={cat.id} />
                      <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
