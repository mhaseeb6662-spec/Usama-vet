import { NextResponse } from "next/server";
import { getAboutVideos } from "@/lib/data/aboutVideos";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const videos = await getAboutVideos();
    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    console.error("[about-videos] GET failed:", error);
    return NextResponse.json(
      { success: false, message: "Could not load about videos." },
      { status: 500 }
    );
  }
}
