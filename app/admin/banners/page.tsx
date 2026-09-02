import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Plus, Trash2, Edit } from "lucide-react";
import ImageUploader from "@/components/admin/ui/ImageUploader";
import AdminActionError from "@/components/admin/AdminActionError";
import { runAdminAction } from "@/lib/admin/mutation";
import { toServedImageUrl } from "@/lib/mediaUrl";

function readBannerImage(formData: FormData) {
  const image = String(formData.get("image") || "").trim();
  const position = String(formData.get("position") || "").trim();

  if (!image) {
    throw new Error("Banner image is required.");
  }
  if (position !== "promo-1" && position !== "promo-2") {
    throw new Error("Banner position is invalid.");
  }

  return {
    name: position === "promo-1" ? "Promo Slot 1" : "Promo Slot 2",
    title: null,
    subtitle: null,
    ctaText: null,
    ctaUrl: null,
    image,
    position,
  };
}

async function addBanner(formData: FormData) {
  "use server";
  await runAdminAction("/admin/banners", async () => {
    const data = readBannerImage(formData);
    await prisma.banner.create({
      data: { ...data, isActive: true },
    });
    redirect("/admin/banners");
  });
}

async function updateBanner(formData: FormData) {
  "use server";
  const id = Number.parseInt(String(formData.get("id") || ""), 10);
  const returnPath = Number.isNaN(id) ? "/admin/banners" : `/admin/banners?edit=${id}`;
  await runAdminAction(returnPath, async () => {
    if (Number.isNaN(id)) {
      throw new Error("Banner id is required to update.");
    }
    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Banner was not found.");
    }
    await prisma.banner.update({
      where: { id },
      data: readBannerImage(formData),
    });
    redirect("/admin/banners");
  });
}

async function deleteBanner(formData: FormData) {
  "use server";
  await runAdminAction("/admin/banners", async () => {
    const id = Number.parseInt(String(formData.get("id") || ""), 10);
    if (Number.isNaN(id)) {
      throw new Error("Banner id is required to delete.");
    }
    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Banner was not found.");
    }
    await prisma.banner.delete({ where: { id } });
    redirect("/admin/banners");
  });
}

export default async function BannersAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; error?: string }>;
}) {
  const params = await searchParams;
  let banners: Awaited<ReturnType<typeof prisma.banner.findMany>> = [];
  let loadError = "";
  try {
    banners = await prisma.banner.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("[admin] banner list failed:", error);
    loadError = "Could not load banners. Please try again.";
  }
  const editId = Number.parseInt(params.edit || "", 10);
  const editing = Number.isNaN(editId) ? null : banners.find((banner) => banner.id === editId) || null;
  if (params.edit && !editing) {
    redirect("/admin/banners");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Manage Promotional Banners</h1>
      </div>
      <AdminActionError message={params.error || loadError} />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4">{editing ? "Edit Banner" : "Add New Banner"}</h2>
          <p className="text-sm text-slate-500 mb-4">Upload the promotional image only. No title or button text is shown on the site.</p>
          <form action={editing ? updateBanner : addBanner} className="space-y-4">
            {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Position *</label>
              <select name="position" required defaultValue={editing?.position || "promo-1"} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="promo-1">Promo Slot 1 (Upper)</option>
                <option value="promo-2">Promo Slot 2 (Lower)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Promotional Image *</label>
              <ImageUploader key={editing ? `banner-${editing.id}` : "banner-new"} name="image" defaultImage={toServedImageUrl(editing?.image || "")} />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors mt-4">
              <Plus className="w-4 h-4" /> {editing ? "Update Banner" : "Save Banner"}
            </button>
            {editing ? (
              <Link href="/admin/banners" className="block text-center text-sm font-semibold text-slate-600 hover:text-emerald-700">Cancel edit</Link>
            ) : null}
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Image</th>
                <th className="px-6 py-4 font-semibold">Position</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">No banners found. Upload an image to show it on the homepage.</td>
                </tr>
              ) : banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={toServedImageUrl(banner.image)} alt="" className="w-48 h-24 object-contain bg-slate-50 rounded shadow-sm border border-slate-200" />
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-bold bg-indigo-100 text-indigo-700 rounded-full">
                      {banner.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/banners?edit=${banner.id}`} className="inline-flex items-center gap-1 px-2 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg">
                        <Edit className="w-4 h-4" /> Edit
                      </Link>
                      <form action={deleteBanner}>
                        <input type="hidden" name="id" value={banner.id} />
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
