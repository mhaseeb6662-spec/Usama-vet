import React from "react";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Plus, Trash2 } from "lucide-react";
import ImageUploader from "@/components/admin/ui/ImageUploader";

async function addHeroSlide(formData: FormData) {
  "use server";
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const description = formData.get("description") as string;
  const desktopImage = formData.get("desktopImage") as string;
  const ctaText = formData.get("ctaText") as string;
  const ctaUrl = formData.get("ctaUrl") as string;
  
  if (!title || !desktopImage) return;

  await prisma.heroSlide.create({
    data: { title, subtitle, description, desktopImage, ctaText, ctaUrl, isActive: true },
  });
  
  revalidatePath("/");
  revalidatePath("/admin/hero");
}

async function deleteHeroSlide(formData: FormData) {
  "use server";
  const id = parseInt(formData.get("id") as string, 10);
  if (isNaN(id)) return;
  await prisma.heroSlide.delete({ where: { id } });
  
  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export default async function HeroAdmin() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Manage Hero Slider</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Add New Slide</h2>
          <form action={addHeroSlide} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Badge / Subtitle</label>
              <input name="subtitle" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Direct Pharmacy & Supplies" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Main Title *</label>
              <input name="title" type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Trusted Veterinary Products" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea name="description" rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-y" placeholder="Short text under title..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CTA Button Text</label>
                <input name="ctaText" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Shop Now" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CTA URL</label>
                <input name="ctaUrl" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. /#products" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Slide Image (Desktop) *</label>
              <ImageUploader name="desktopImage" />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors mt-4">
              <Plus className="w-4 h-4" /> Save Slide
            </button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold w-24">Image</th>
                <th className="px-6 py-4 font-semibold">Slide Details</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {slides.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">No slides found. Add one to show on homepage!</td>
                </tr>
              ) : slides.map((slide) => (
                <tr key={slide.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slide.desktopImage} alt={slide.title} className="w-20 h-12 object-cover rounded shadow-sm border border-slate-200" />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{slide.title}</p>
                    <p className="text-xs text-emerald-600 font-medium mb-1">{slide.subtitle}</p>
                    <p className="text-slate-500 text-xs line-clamp-1 max-w-sm">{slide.description}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={deleteHeroSlide}>
                      <input type="hidden" name="id" value={slide.id} />
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
