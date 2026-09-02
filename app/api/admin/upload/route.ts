import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/imageStorage";
import { getSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const url = await uploadImage(file);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload Error:", error);
    const message = error instanceof Error && error.message.trim()
      ? error.message
      : "Failed to upload image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
