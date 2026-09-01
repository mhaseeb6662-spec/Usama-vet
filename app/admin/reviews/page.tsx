import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CheckCircle, XCircle, Trash2, Star, Plus, Edit } from "lucide-react";

function revalidateReviewPages() {
  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath("/admin/reviews");
}

function readReviewFields(formData: FormData) {
  const displayName = String(formData.get("displayName") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const whatsappNumber = String(formData.get("whatsappNumber") || "").trim();
  const rating = Number.parseInt(String(formData.get("rating") || ""), 10);

  if (!displayName) {
    throw new Error("Customer name is required.");
  }
  if (!title) {
    throw new Error("Review title is required.");
  }
  if (!content) {
    throw new Error("Review content is required.");
  }
  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5 stars.");
  }

  return { displayName, title, content, whatsappNumber: whatsappNumber || null, rating };
}

async function addReview(formData: FormData) {
  "use server";
  const fields = readReviewFields(formData);

  await prisma.review.create({
    data: {
      ...fields,
      status: "APPROVED",
      isVerified: true,
    },
  });

  revalidateReviewPages();
}

async function updateReview(formData: FormData) {
  "use server";
  const id = Number.parseInt(String(formData.get("id") || ""), 10);
  if (Number.isNaN(id)) {
    throw new Error("Review id is required to update.");
  }

  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Review was not found.");
  }

  const fields = readReviewFields(formData);
  const statusRaw = String(formData.get("status") || existing.status);
  if (statusRaw !== "PENDING" && statusRaw !== "APPROVED" && statusRaw !== "REJECTED") {
    throw new Error("Review status is invalid.");
  }

  await prisma.review.update({
    where: { id },
    data: {
      ...fields,
      status: statusRaw,
    },
  });

  revalidateReviewPages();
  redirect("/admin/reviews");
}

async function updateReviewStatus(formData: FormData) {
  "use server";
  const id = Number.parseInt(String(formData.get("id") || ""), 10);
  const status = String(formData.get("status") || "");
  if (Number.isNaN(id)) {
    throw new Error("Review id is required to update status.");
  }
  if (status !== "APPROVED" && status !== "REJECTED") {
    throw new Error("Review status is invalid.");
  }

  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Review was not found.");
  }

  await prisma.review.update({ where: { id }, data: { status } });
  revalidateReviewPages();
}

async function deleteReview(formData: FormData) {
  "use server";
  const id = Number.parseInt(String(formData.get("id") || ""), 10);
  if (Number.isNaN(id)) {
    throw new Error("Review id is required to delete.");
  }

  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Review was not found.");
  }

  await prisma.review.delete({ where: { id } });
  revalidateReviewPages();
}

export default async function ReviewsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const params = await searchParams;
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });
  const editId = Number.parseInt(params.edit || "", 10);
  const editing = Number.isNaN(editId) ? null : reviews.find((review) => review.id === editId) || null;
  if (params.edit && !editing) {
    throw new Error("Review was not found for editing.");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4">{editing ? "Edit Review" : "Add Review"}</h2>
          <p className="text-xs text-slate-500 mb-4">
            Reviews added here are published immediately on the homepage and the Reviews page. Customer reviews submitted on the website still need approval.
          </p>
          <form action={editing ? updateReview : addReview} className="space-y-4">
            {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name *</label>
              <input name="displayName" type="text" required defaultValue={editing?.displayName || ""} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Ahmed Khan" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Review Title *</label>
              <input name="title" type="text" required defaultValue={editing?.title || ""} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Excellent cattle supplements" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Review Content *</label>
              <textarea name="content" required rows={4} defaultValue={editing?.content || ""} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-y" placeholder="Customer feedback..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rating *</label>
              <select name="rating" required defaultValue={editing?.rating || 5} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                <option value={5}>5 stars</option>
                <option value={4}>4 stars</option>
                <option value={3}>3 stars</option>
                <option value={2}>2 stars</option>
                <option value={1}>1 star</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
              <input name="whatsappNumber" type="tel" defaultValue={editing?.whatsappNumber || ""} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Optional" />
            </div>
            {editing ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select name="status" defaultValue={editing.status} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                  <option value="APPROVED">Approved (shown on site)</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            ) : null}
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" /> {editing ? "Update Review" : "Publish Review"}
            </button>
            {editing ? (
              <Link href="/admin/reviews" className="block text-center text-sm font-semibold text-slate-600 hover:text-emerald-700">
                Cancel edit
              </Link>
            ) : null}
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Rating</th>
                <th className="px-6 py-4 font-semibold">Review</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No reviews found.</td></tr>
              ) : reviews.map((review) => (
                <tr key={review.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{review.displayName}</div>
                    <div className="text-xs text-slate-400">{review.whatsappNumber || "Added from dashboard"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-amber-400" : "text-slate-200 stroke-slate-300"}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="font-semibold text-slate-800">{review.title}</div>
                    <div className="text-slate-500 truncate">{review.content}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      review.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" :
                      review.status === "REJECTED" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/reviews?edit=${review.id}`} title="Edit" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      {review.status === "PENDING" && (
                        <>
                          <form action={updateReviewStatus}>
                            <input type="hidden" name="id" value={review.id} />
                            <input type="hidden" name="status" value="APPROVED" />
                            <button type="submit" title="Approve" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><CheckCircle className="w-4 h-4" /></button>
                          </form>
                          <form action={updateReviewStatus}>
                            <input type="hidden" name="id" value={review.id} />
                            <input type="hidden" name="status" value="REJECTED" />
                            <button type="submit" title="Reject" className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"><XCircle className="w-4 h-4" /></button>
                          </form>
                        </>
                      )}
                      <form action={deleteReview}>
                        <input type="hidden" name="id" value={review.id} />
                        <button type="submit" title="Delete" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
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
