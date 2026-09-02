import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Plus, Trash2, Edit } from "lucide-react";
import AdminActionError from "@/components/admin/AdminActionError";
import { runAdminAction } from "@/lib/admin/mutation";
import { ensureAboutVideoTable } from "@/lib/data/aboutVideos";
import VideoUploader from "@/components/admin/ui/VideoUploader";
import ImageUploader from "@/components/admin/ui/ImageUploader";
import { deleteVideo } from "@/lib/videoStorage";
import { deleteImage } from "@/lib/imageStorage";

function readVideoFields(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const videoUrl = String(formData.get("videoUrl") || "").trim();
  const thumbnail = String(formData.get("thumbnail") || "").trim();
  const sortOrder = Number.parseInt(String(formData.get("sortOrder") || "0"), 10);

  if (!title) {
    throw new Error("Video title is required.");
  }
  if (!videoUrl.startsWith("/api/videos/")) {
    throw new Error("Upload a video file before saving.");
  }

  return {
    title,
    description: description || null,
    videoUrl,
    embedUrl: videoUrl,
    thumbnail,
    sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
  };
}

async function loadVideoList() {
  return prisma.aboutVideo.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

async function addAboutVideo(formData: FormData) {
  "use server";
  await runAdminAction("/admin/videos", async () => {
    const fields = readVideoFields(formData);
    await ensureAboutVideoTable();
    await prisma.aboutVideo.create({
      data: {
        ...fields,
        isActive: true,
      },
    });
    redirect("/admin/videos");
  });
}

async function updateAboutVideo(formData: FormData) {
  "use server";
  const id = Number.parseInt(String(formData.get("id") || ""), 10);
  const returnPath = Number.isNaN(id) ? "/admin/videos" : `/admin/videos?edit=${id}`;
  await runAdminAction(returnPath, async () => {
    if (Number.isNaN(id)) {
      throw new Error("Video id is required to update.");
    }
    const existing = await prisma.aboutVideo.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Video was not found.");
    }

    const fields = readVideoFields(formData);
    await prisma.aboutVideo.update({
      where: { id },
      data: fields,
    });

    if (existing.videoUrl !== fields.videoUrl) {
      await deleteVideo(existing.videoUrl);
    }
    if (existing.thumbnail && existing.thumbnail !== fields.thumbnail) {
      await deleteImage(existing.thumbnail);
    }

    redirect("/admin/videos");
  });
}

async function toggleAboutVideo(formData: FormData) {
  "use server";
  await runAdminAction("/admin/videos", async () => {
    const id = Number.parseInt(String(formData.get("id") || ""), 10);
    const isActive = formData.get("isActive") === "true";
    if (Number.isNaN(id)) {
      throw new Error("Video id is required to update visibility.");
    }

    await prisma.aboutVideo.update({
      where: { id },
      data: { isActive: !isActive },
    });

    redirect("/admin/videos");
  });
}

async function deleteAboutVideo(formData: FormData) {
  "use server";
  await runAdminAction("/admin/videos", async () => {
    const id = Number.parseInt(String(formData.get("id") || ""), 10);
    if (Number.isNaN(id)) {
      throw new Error("Video id is required to delete.");
    }

    const video = await prisma.aboutVideo.findUnique({ where: { id } });
    if (!video) {
      throw new Error("Video was not found.");
    }

    await prisma.aboutVideo.delete({ where: { id } });
    await deleteVideo(video.videoUrl);
    if (video.thumbnail) {
      await deleteImage(video.thumbnail);
    }

    redirect("/admin/videos");
  });
}

export default async function AboutVideosAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; error?: string }>;
}) {
  const params = await searchParams;
  let videos: Awaited<ReturnType<typeof loadVideoList>> = [];
  let loadError = "";
  try {
    await ensureAboutVideoTable();
    videos = await loadVideoList();
  } catch (error) {
    console.error("[admin] video list failed:", error);
    loadError = "Could not load videos. Please try again.";
  }
  const editId = Number.parseInt(params.edit || "", 10);
  const editing = Number.isNaN(editId) ? null : videos.find((video) => video.id === editId) || null;
  if (params.edit && !editing) {
    redirect("/admin/videos");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">About Page Videos</h1>
      </div>
      <AdminActionError message={params.error || loadError} />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4">{editing ? "Edit Video" : "Upload Video"}</h2>
          <form action={editing ? updateAboutVideo : addAboutVideo} className="space-y-4">
            {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input name="title" type="text" required defaultValue={editing?.title || ""} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Warehouse Tour" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea name="description" rows={3} defaultValue={editing?.description || ""} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-y" placeholder="Short text under the video..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Video File *</label>
              <VideoUploader key={editing ? `video-${editing.id}` : "video-new"} name="videoUrl" defaultVideo={editing?.videoUrl || ""} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image (optional)</label>
              <ImageUploader key={editing ? `thumb-${editing.id}` : "thumb-new"} name="thumbnail" defaultImage={editing?.thumbnail || ""} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
              <input name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? 0} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors mt-4">
              <Plus className="w-4 h-4" /> {editing ? "Update Video" : "Save Video"}
            </button>
            {editing ? (
              <Link href="/admin/videos" className="block text-center text-sm font-semibold text-slate-600 hover:text-emerald-700">Cancel edit</Link>
            ) : null}
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
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No videos yet. Upload a video to show it on the About page.</td>
                </tr>
              ) : videos.map((video) => (
                <tr key={video.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    {video.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={video.thumbnail} alt={video.title} className="w-20 h-12 object-cover rounded shadow-sm border border-slate-200" />
                    ) : (
                      <video src={video.videoUrl} className="w-20 h-12 object-cover rounded shadow-sm border border-slate-200" muted />
                    )}
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
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/videos?edit=${video.id}`} className="inline-flex items-center gap-1 px-2 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg">
                        <Edit className="w-4 h-4" /> Edit
                      </Link>
                      <form action={deleteAboutVideo}>
                        <input type="hidden" name="id" value={video.id} />
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
