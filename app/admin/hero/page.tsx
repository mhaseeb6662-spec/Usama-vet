import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Plus, Trash2, Edit } from "lucide-react";
import ImageUploader from "@/components/admin/ui/ImageUploader";

function readHeroFields(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const subtitle = String(formData.get("subtitle") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const desktopImage = String(formData.get("desktopImage") || "").trim();
  const ctaText = String(formData.get("ctaText") || "").trim();
  const ctaUrl = String(formData.get("ctaUrl") || "").trim();

  if (!title) {
    throw new Error("Slide title is required.");
  }
  if (!desktopImage) {
    throw new Error("Slide image is required.");
  }

  return { title, subtitle, description, desktopImage, ctaText, ctaUrl };
}

async function addHeroSlide(formData: FormData) {
  "use server";
  await prisma.heroSlide.create({
    data: { ...readHeroFields(formData), isActive: true },
  });
  revalidatePath("/");
  revalidatePath("/admin/hero");
}

async function updateHeroSlide(formData: FormData) {
  "use server";
  const id = Number.parseInt(String(formData.get("id") || ""), 10);
  if (Number.isNaN(id)) {
    throw new Error("Slide id is required to update.");
  }
  const existing = await prisma.heroSlide.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Slide was not found.");
  }
  await prisma.heroSlide.update({
    where: { id },
    data: readHeroFields(formData),
  });
  revalidatePath("/");
  revalidatePath("/admin/hero");
  redirect("/admin/hero");
}

async function deleteHeroSlide(formData: FormData) {
  "use server";
  const id = Number.parseInt(String(formData.get("id") || ""), 10);
  if (Number.isNaN(id)) {
    throw new Error("Slide id is required to delete.");
  }
  const existing = await prisma.heroSlide.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Slide was not found.");
  }
  await prisma.heroSlide.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export default async function HeroAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const params = await searchParams;
  const slides = await prisma.heroSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const editId = Number.parseInt(params.edit || "", 10);
  const editing = Number.isNaN(editId) ? null : slides.find((slide) => slide.id === editId) || null;
  if (params.edit && !editing) {
    throw new Error("Slide was not found for editing.");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Manage Hero Slider</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4">{editing ? "Edit Slide" : "Add New Slide"}</h2>
          <form action={editing ? updateHeroSlide : addHeroSlide} className="space-y-4">
            {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Badge / Subtitle</label>
              <input name="subtitle" type="text" defaultValue={editing?.subtitle || ""} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Direct Pharmacy & Supplies" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Main Title *</label>
              <input name="title" type="text" required defaultValue={editing?.title || ""} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Trusted Veterinary Products" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea name="description" rows={3} defaultValue={editing?.description || ""} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-y" placeholder="Short text under title..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CTA Button Text</label>
                <input name="ctaText" type="text" defaultValue={editing?.ctaText || ""} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Shop Now" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CTA URL</label>
                <input name="ctaUrl" type="text" defaultValue={editing?.ctaUrl || ""} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. /#products" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Slide Image (Desktop) *</label>
              <ImageUploader key={editing ? `hero-${editing.id}` : "hero-new"} name="desktopImage" defaultImage={editing?.desktopImage || ""} />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors mt-4">
              <Plus className="w-4 h-4" /> {editing ? "Update Slide" : "Save Slide"}
            </button>
            {editing ? (
              <Link href="/admin/hero" className="block text-center text-sm font-semibold text-slate-600 hover:text-emerald-700">Cancel edit</Link>
            ) : null}
          </form>
        </div>

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
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/hero?edit=${slide.id}`} className="inline-flex items-center gap-1 px-2 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg">
                        <Edit className="w-4 h-4" /> Edit
                      </Link>
                      <form action={deleteHeroSlide}>
                        <input type="hidden" name="id" value={slide.id} />
                        <button type="submit" className="inline-flex items-center gap-1 px-2 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" /> Delete
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
