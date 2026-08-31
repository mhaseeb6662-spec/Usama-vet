import React from "react";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CheckCircle, XCircle, Trash2, Star } from "lucide-react";

async function updateReviewStatus(formData: FormData) {
  "use server";
  const id = parseInt(formData.get("id") as string, 10);
  const status = formData.get("status") as any;
  if (!isNaN(id)) {
    await prisma.review.update({ where: { id }, data: { status } });
  }
  revalidatePath("/admin/reviews");
}

async function deleteReview(formData: FormData) {
  "use server";
  const id = parseInt(formData.get("id") as string, 10);
  if (!isNaN(id)) {
    await prisma.review.delete({ where: { id } });
  }
  revalidatePath("/admin/reviews");
}

export default async function ReviewsAdmin() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Review Moderation</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
                  <div className="text-xs text-slate-400">{review.whatsappNumber}</div>
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
                    review.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                    review.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {review.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  {review.status === 'PENDING' && (
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
