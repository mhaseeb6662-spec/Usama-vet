import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "APPROVED";
    
    const reviews = await prisma.review.findMany({
      where: { status: status as any },
      orderBy: { createdAt: "desc" },
      include: { images: true },
    });
    
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch reviews." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rating, title, content, displayName, whatsappNumber } = body;
    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json({ success: false, message: "Rating must be between 1 and 5." }, { status: 400 });
    }
    if (typeof title !== "string" || !title.trim() || typeof content !== "string" || !content.trim() || typeof displayName !== "string" || !displayName.trim() || typeof whatsappNumber !== "string" || !whatsappNumber.trim()) {
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        rating: parsedRating,
        title: title.trim(),
        content: content.trim(),
        displayName: displayName.trim(),
        whatsappNumber: whatsappNumber.trim(),
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, data: review, message: "Review submitted for approval." });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ success: false, message: "Failed to submit review." }, { status: 500 });
  }
}
