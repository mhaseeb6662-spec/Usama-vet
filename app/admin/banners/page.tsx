import React from "react";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Plus, Trash2 } from "lucide-react";
import ImageUploader from "@/components/admin/ui/ImageUploader";

async function addBanner(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const ctaText = formData.get("ctaText") as string;
  const ctaUrl = formData.get("ctaUrl") as string;
  const image = formData.get("image") as string;
  const position = formData.get("position") as string;
  
  if (!name || !image || !position) return;

  await prisma.banner.create({
    data: { name, title, subtitle, ctaText, ctaUrl, image, position, isActive: true },
  });
  
  revalidatePath("/");
  revalidatePath("/admin/banners");
}

async function deleteBanner(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) return;
  await prisma.banner.delete({ where: { id } });
  
  revalidatePath("/");
  revalidatePath("/admin/banners");
}

export default async function BannersAdmin() {
  const banners = await prisma.banner.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Manage Promotional Banners</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Add New Banner</h2>
          <form action={addBanner} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Internal Name *</label>
              <input name="name" type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Winter Sale 2026" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Position *</label>
              <select name="position" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="promo-1">Promo Slot 1 (Upper)</option>
                <option value="promo-2">Promo Slot 2 (Lower)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Main Title</label>
              <input name="title" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Amazing Offers Inside..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
              <textarea name="subtitle" rows={2} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-y" placeholder="Get premium antibiotics..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CTA Text</label>
                <input name="ctaText" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Shop Now" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CTA URL</label>
                <input name="ctaUrl" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="/#products" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Banner Background Image *</label>
              <ImageUploader name="image" />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors mt-4">
              <Plus className="w-4 h-4" /> Save Banner
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold w-24">Image</th>
                <th className="px-6 py-4 font-semibold">Banner Details</th>
                <th className="px-6 py-4 font-semibold">Position</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No banners found.</td>
                </tr>
              ) : banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={banner.image} alt={banner.name} className="w-20 h-12 object-cover rounded shadow-sm border border-slate-200" />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{banner.name}</p>
                    {banner.title && <p className="text-xs text-slate-600 mt-1 line-clamp-1">{banner.title}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-bold bg-indigo-100 text-indigo-700 rounded-full">
                      {banner.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end">
                    <form action={deleteBanner}>
                      <input type="hidden" name="id" value={banner.id} />
                      <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block">
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
