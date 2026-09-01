import { NextRequest, NextResponse } from "next/server";
import { uploadVideo } from "@/lib/videoStorage";
import { getSession } from "@/lib/session";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 });
    }

    const url = await uploadVideo(file);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Video upload failed:", error);
    const message = error instanceof Error ? error.message : "Failed to upload video";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
