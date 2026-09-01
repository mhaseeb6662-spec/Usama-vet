import { NextResponse } from "next/server";
import { pingDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await pingDatabase();
    return NextResponse.json({ success: true, status: "ok" });
  } catch (error) {
    console.error("[health] Database ping failed:", error);
    return NextResponse.json(
      { success: false, message: "Database is not reachable." },
      { status: 503 }
    );
  }
}
