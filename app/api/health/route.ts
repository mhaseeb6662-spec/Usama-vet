import { NextResponse } from "next/server";
import { pingDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

function envFlags() {
  return {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
    NODE_ENV: process.env.NODE_ENV || null,
    SITE_URL: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
  };
}

export async function GET() {
  try {
    await pingDatabase();
    return NextResponse.json({
      success: true,
      status: "ok",
      env: envFlags(),
    });
  } catch (error) {
    console.error("[health] Database ping failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Database is not reachable.",
        env: envFlags(),
      },
      { status: 503 }
    );
  }
}
