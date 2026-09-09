import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/imageStorage";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const url = await uploadImage(file);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("[upload/payment-proof] failed:", error);
    const message =
      error instanceof Error && error.message.trim()
        ? error.message
        : "Failed to upload payment screenshot.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
