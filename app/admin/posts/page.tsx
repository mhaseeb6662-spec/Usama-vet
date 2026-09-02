import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Plus, Trash2, Edit } from "lucide-react";
import ImageUploader from "@/components/admin/ui/ImageUploader";
import AdminActionError from "@/components/admin/AdminActionError";
import { runAdminAction } from "@/lib/admin/mutation";
import { toServedImageUrl } from "@/lib/mediaUrl";
import { deleteImage } from "@/lib/imageStorage";
import { ensureHowToOrderPostTable } from "@/lib/data/howToOrderPosts";

function readPostFields(formData: FormData) {
  const image = String(formData.get("image") || "").trim();

  if (!image) {
    throw new Error("Upload a post image before saving.");
  }

  return {
    title: null,
    body: null,
    image,
  };
}

async function loadPostList() {
  return prisma.howToOrderPost.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

async function addPost(formData: FormData) {
  "use server";
  await runAdminAction("/admin/posts", async () => {
    await ensureHowToOrderPostTable();
    await prisma.howToOrderPost.create({
      data: {
        ...readPostFields(formData),
        isActive: true,
      },
    });
    redirect("/admin/posts");
  });
}

async function updatePost(formData: FormData) {
  "use server";
  const id = Number.parseInt(String(formData.get("id") || ""), 10);
  const returnPath = Number.isNaN(id) ? "/admin/posts" : `/admin/posts?edit=${id}`;
  await runAdminAction(returnPath, async () => {
    if (Number.isNaN(id)) {
      throw new Error("Post id is required to update.");
    }
    const existing = await prisma.howToOrderPost.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Post was not found.");
    }
    const fields = readPostFields(formData);
    await prisma.howToOrderPost.update({
      where: { id },
      data: fields,
    });
    if (existing.image && existing.image !== fields.image) {
      await deleteImage(existing.image);
    }
    redirect("/admin/posts");
  });
}

async function togglePost(formData: FormData) {
  "use server";
  await runAdminAction("/admin/posts", async () => {
    const id = Number.parseInt(String(formData.get("id") || ""), 10);
    const isActive = formData.get("isActive") === "true";
    if (Number.isNaN(id)) {
      throw new Error("Post id is required to update visibility.");
    }
    await prisma.howToOrderPost.update({
      where: { id },
      data: { isActive: !isActive },
    });
    redirect("/admin/posts");
  });
}

async function deletePost(formData: FormData) {
  "use server";
  await runAdminAction("/admin/posts", async () => {
    const id = Number.parseInt(String(formData.get("id") || ""), 10);
    if (Number.isNaN(id)) {
      throw new Error("Post id is required to delete.");
    }
    const existing = await prisma.howToOrderPost.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Post was not found.");
    }
    await prisma.howToOrderPost.delete({ where: { id } });
    if (existing.image) {
      await deleteImage(existing.image);
    }
    redirect("/admin/posts");
  });
}

export default async function HowToOrderPostsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; error?: string }>;
}) {
  const params = await searchParams;
  let posts: Awaited<ReturnType<typeof loadPostList>> = [];
  let loadError = "";
  try {
    await ensureHowToOrderPostTable();
    posts = await loadPostList();
  } catch (error) {
    console.error("[admin] post list failed:", error);
    loadError = "Could not load posts. Please try again.";
  }
  const editId = Number.parseInt(params.edit || "", 10);
  const editing = Number.isNaN(editId) ? null : posts.find((post) => post.id === editId) || null;
  if (params.edit && !editing) {
    redirect("/admin/posts");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">How to Order Posts</h1>
      </div>
      <p className="text-sm text-slate-500">
        Upload an image only. It appears full width on the How to Order page.
      </p>
      <AdminActionError message={params.error || loadError} />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4">{editing ? "Edit Post" : "Add Post"}</h2>
          <form action={editing ? updatePost : addPost} className="space-y-4">
            {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Post image *</label>
              <ImageUploader
                key={editing ? `post-${editing.id}` : "post-new"}
                name="image"
                defaultImage={toServedImageUrl(editing?.image || "")}
              />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors mt-4">
              <Plus className="w-4 h-4" /> {editing ? "Update Post" : "Publish Post"}
            </button>
            {editing ? (
              <Link href="/admin/posts" className="block text-center text-sm font-semibold text-slate-600 hover:text-emerald-700">
                Cancel edit
              </Link>
            ) : null}
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Post</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    No posts yet. Publish one to show it on How to Order.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      {post.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={toServedImageUrl(post.image)}
                          alt=""
                          className="w-48 h-24 object-contain bg-slate-50 rounded border border-slate-200"
                        />
                      ) : (
                        <span className="text-slate-400">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${post.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        {post.isActive ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <Link href={`/admin/posts?edit=${post.id}`} className="inline-flex items-center gap-1 px-2 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg">
                          <Edit className="w-4 h-4" /> Edit
                        </Link>
                        <form action={togglePost}>
                          <input type="hidden" name="id" value={post.id} />
                          <input type="hidden" name="isActive" value={String(post.isActive)} />
                          <button type="submit" className="inline-flex items-center gap-1 px-2 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg">
                            {post.isActive ? "Hide" : "Show"}
                          </button>
                        </form>
                        <form action={deletePost}>
                          <input type="hidden" name="id" value={post.id} />
                          <button type="submit" className="inline-flex items-center gap-1 px-2 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
