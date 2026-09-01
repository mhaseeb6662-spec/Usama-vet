import { prisma } from "@/lib/db";
import { cache } from "react";
import type { Review as UIReview } from "@/types";
import type { Review as PrismaReview } from "@prisma/client";

export function mapReviewToHomeCard(review: PrismaReview): UIReview {
  const userName = review.displayName?.trim();
  const comment = review.content?.trim() || review.title?.trim();
  if (!userName) {
    throw new Error(`Review ${review.id} is missing a display name.`);
  }
  if (!comment) {
    throw new Error(`Review ${review.id} is missing review text.`);
  }

  return {
    id: String(review.id),
    userName,
    userDesignation: review.title?.trim() || undefined,
    rating: review.rating,
    comment,
    date: review.createdAt.toISOString(),
    verifiedPurchase: review.isVerified,
  };
}

export const getApprovedHomeReviews = cache(async (): Promise<UIReview[]> => {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 24,
    });

    const mapped: UIReview[] = [];
    for (const review of reviews) {
      try {
        mapped.push(mapReviewToHomeCard(review));
      } catch (error) {
        console.error("[reviews] Approved review cannot be shown on the homepage:", error);
      }
    }
    return mapped;
  } catch (error) {
    console.error("[reviews] Failed to load homepage reviews:", error);
    return [];
  }
});
