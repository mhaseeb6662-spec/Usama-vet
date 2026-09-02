import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Plus, Trash2, Edit } from "lucide-react";
import ImageUploader from "@/components/admin/ui/ImageUploader";
import AdminActionError from "@/components/admin/AdminActionError";
import { runAdminAction } from "@/lib/admin/mutation";
import { toServedImageUrl } from "@/lib/mediaUrl";
import { ensureCategorySchema } from "@/lib/services/categorySchema";
import {
  createAdminCategory,
  deleteAdminCategory,
  toggleAdminCategoryHomepage,
  updateAdminCategory,
} from "@/lib/services/adminCategory";

async function loadCategoryList() {
  return prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });
}

async function addCategory(formData: FormData) {
  "use server";
  await runAdminAction("/admin/categories", async () => {
    await createAdminCategory(formData);
    redirect("/admin/categories");
  });
}

async function updateCategory(formData: FormData) {
  "use server";
  const id = Number.parseInt(String(formData.get("id") || ""), 10);
  const returnPath = Number.isNaN(id) ? "/admin/categories" : `/admin/categories?edit=${id}`;
  await runAdminAction(returnPath, async () => {
    await updateAdminCategory(formData);
    redirect("/admin/categories");
  });
}

async function deleteCategory(formData: FormData) {
  "use server";
  await runAdminAction("/admin/categories", async () => {
    const id = Number.parseInt(String(formData.get("id") || ""), 10);
    if (Number.isNaN(id)) {
      throw new Error("Category id is required to delete.");
    }
    await deleteAdminCategory(id);
    redirect("/admin/categories");
  });
}

async function toggleHomepageCategory(formData: FormData) {
  "use server";
  await runAdminAction("/admin/categories", async () => {
    await toggleAdminCategoryHomepage(formData);
    redirect("/admin/categories");
  });
}

export default async function CategoriesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; error?: string }>;
}) {
  const params = await searchParams;
  let categories: Awaited<ReturnType<typeof loadCategoryList>> = [];
  let loadError = "";
  try {
    await ensureCategorySchema();
    categories = await loadCategoryList();
  } catch (error) {
    console.error("[admin] category list failed:", error);
    loadError = "Could not load categories. Please try again.";
  }
  const editId = Number.parseInt(params.edit || "", 10);
  const editing = Number.isNaN(editId) ? null : categories.find((category) => category.id === editId) || null;
  if (params.edit && !editing) {
    redirect("/admin/categories");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Manage Categories</h1>
      </div>
      <AdminActionError message={params.error || loadError} />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4">{editing ? "Edit Category" : "Add New Category"}</h2>
          <p className="text-xs text-slate-500 mb-4">
            Name and picture added here appear in Shop by Categories when you turn homepage visibility on.
          </p>
          <form action={editing ? updateCategory : addCategory} className="space-y-4">
            {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category Name *</label>
              <input name="name" type="text" required defaultValue={editing?.name || ""} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Pet Food" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category Picture</label>
              <ImageUploader key={editing ? `category-${editing.id}` : "category-new"} name="image" defaultImage={toServedImageUrl(editing?.image || "")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
              <textarea name="description" rows={3} defaultValue={editing?.description || ""} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Category details..." />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="showOnHomepage" defaultChecked={editing ? Boolean(editing.showOnHomepage) : false} className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
              <span className="text-sm font-medium text-slate-700">Show in Shop by Categories</span>
            </label>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" /> {editing ? "Update Category" : "Save Category"}
            </button>
            {editing ? (
              <Link href="/admin/categories" className="block text-center text-sm font-semibold text-slate-600 hover:text-emerald-700">
                Cancel edit
              </Link>
            ) : null}
          </form>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold w-20">Picture</th>
                <th className="px-6 py-4 font-semibold">Category Name</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold">Products</th>
                <th className="px-6 py-4 font-semibold">Homepage</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No categories found.</td>
                </tr>
              ) : categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    {cat.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={toServedImageUrl(cat.image)} alt={cat.name} className="w-12 h-12 rounded-full object-contain bg-slate-50 border border-slate-200" />
                    ) : (
                      <span className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                        {cat.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                  <td className="px-6 py-4 text-slate-500">{cat.slug}</td>
                  <td className="px-6 py-4 text-slate-500">{cat._count.products}</td>
                  <td className="px-6 py-4">
                    <form action={toggleHomepageCategory}>
                      <input type="hidden" name="id" value={String(cat.id)} />
                      <input type="hidden" name="showOnHomepage" value={String(cat.showOnHomepage)} />
                      <button
                        type="submit"
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          cat.showOnHomepage
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {cat.showOnHomepage ? "Visible" : "Hidden"}
                      </button>
                    </form>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/categories?edit=${cat.id}`} title="Edit" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <form action={deleteCategory}>
                        <input type="hidden" name="id" value={String(cat.id)} />
                        <button type="submit" title="Delete" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
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
