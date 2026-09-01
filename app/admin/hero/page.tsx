import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Plus, Trash2, Edit } from "lucide-react";
import ImageUploader from "@/components/admin/ui/ImageUploader";
import { toServedImageUrl } from "@/lib/mediaUrl";

function readHeroImage(formData: FormData) {
  const desktopImage = String(formData.get("desktopImage") || "").trim();
  if (!desktopImage) {
    throw new Error("Slide image is required.");
  }
  return desktopImage;
}

async function addHeroSlide(formData: FormData) {
  "use server";
  const desktopImage = readHeroImage(formData);
  await prisma.heroSlide.create({
    data: {
      title: "Hero slide",
      subtitle: null,
      description: null,
      desktopImage,
      ctaText: null,
      ctaUrl: null,
      isActive: true,
    },
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
    data: {
      desktopImage: readHeroImage(formData),
      subtitle: null,
      description: null,
      ctaText: null,
      ctaUrl: null,
    },
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
  let slides: Awaited<ReturnType<typeof prisma.heroSlide.findMany>> = [];
  let loadError = "";
  try {
    slides = await prisma.heroSlide.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("[admin] hero list failed:", error);
    loadError = "Could not load hero slides. Please try again.";
  }

  const editId = Number.parseInt(params.edit || "", 10);
  const editing = Number.isNaN(editId) ? null : slides.find((slide) => slide.id === editId) || null;
  if (params.edit && !editing) {
    redirect("/admin/hero");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Manage Hero Slider</h1>
      </div>
      {loadError ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600">{loadError}</div>
      ) : null}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4">{editing ? "Edit Slide" : "Add New Slide"}</h2>
          <p className="text-sm text-slate-500 mb-4">Upload the homepage slider image only. No title or button text is shown on the site.</p>
          <form action={editing ? updateHeroSlide : addHeroSlide} className="space-y-4">
            {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Homepage Slide Image *</label>
              <ImageUploader
                key={editing ? `hero-${editing.id}` : "hero-new"}
                name="desktopImage"
                defaultImage={toServedImageUrl(editing?.desktopImage || "")}
              />
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
                <th className="px-6 py-4 font-semibold">Image</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {slides.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-slate-500">No slides found. Upload an image to show it on the homepage.</td>
                </tr>
              ) : slides.map((slide) => (
                <tr key={slide.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={toServedImageUrl(slide.desktopImage)} alt="" className="w-32 h-16 object-contain bg-slate-50 rounded shadow-sm border border-slate-200" />
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
