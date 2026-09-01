import React from "react";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Plus, Trash2 } from "lucide-react";
import { parseYoutubeUrl } from "@/lib/youtube";
import { ensureAboutVideoTable } from "@/lib/data/aboutVideos";

async function addAboutVideo(formData: FormData) {
  "use server";
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const videoUrl = String(formData.get("videoUrl") || "").trim();
  const sortOrderRaw = String(formData.get("sortOrder") || "0").trim();
  const sortOrder = Number.parseInt(sortOrderRaw, 10);

  if (!title) {
    throw new Error("Video title is required.");
  }

  const parsed = parseYoutubeUrl(videoUrl);
  await ensureAboutVideoTable();

  await prisma.aboutVideo.create({
    data: {
      title,
      description: description || null,
      videoUrl,
      embedUrl: parsed.embedUrl,
      thumbnail: parsed.thumbnail,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
      isActive: true,
    },
  });

  revalidatePath("/about");
  revalidatePath("/admin/videos");
}

async function toggleAboutVideo(formData: FormData) {
  "use server";
  const id = parseInt(String(formData.get("id") || ""), 10);
  const isActive = formData.get("isActive") === "true";
  if (Number.isNaN(id)) {
    throw new Error("Video id is required to update visibility.");
  }

  await prisma.aboutVideo.update({
    where: { id },
    data: { isActive: !isActive },
  });

  revalidatePath("/about");
  revalidatePath("/admin/videos");
}

async function deleteAboutVideo(formData: FormData) {
  "use server";
  const id = parseInt(String(formData.get("id") || ""), 10);
  if (Number.isNaN(id)) {
    throw new Error("Video id is required to delete.");
  }

  await prisma.aboutVideo.delete({ where: { id } });

  revalidatePath("/about");
  revalidatePath("/admin/videos");
}

export default async function AboutVideosAdmin() {
  await ensureAboutVideoTable();
  const videos = await prisma.aboutVideo.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">About Page Videos</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Add YouTube Video</h2>
          <form action={addAboutVideo} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input name="title" type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Warehouse Tour" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea name="description" rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-y" placeholder="Short text under the video..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">YouTube URL *</label>
              <input name="videoUrl" type="url" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://www.youtube.com/watch?v=..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
              <input name="sortOrder" type="number" defaultValue={0} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors mt-4">
              <Plus className="w-4 h-4" /> Save Video
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold w-24">Thumbnail</th>
                <th className="px-6 py-4 font-semibold">Video</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No videos yet. Add a YouTube link to show it on the About page.</td>
                </tr>
              ) : videos.map((video) => (
                <tr key={video.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={video.thumbnail} alt={video.title} className="w-20 h-12 object-cover rounded shadow-sm border border-slate-200" />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{video.title}</p>
                    <p className="text-slate-500 text-xs line-clamp-1 max-w-sm">{video.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <form action={toggleAboutVideo}>
                      <input type="hidden" name="id" value={video.id} />
                      <input type="hidden" name="isActive" value={String(video.isActive)} />
                      <button
                        type="submit"
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          video.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {video.isActive ? "Visible" : "Hidden"}
                      </button>
                    </form>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={deleteAboutVideo}>
                      <input type="hidden" name="id" value={video.id} />
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
