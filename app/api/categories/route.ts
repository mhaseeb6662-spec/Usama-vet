import { NextResponse } from "next/server";
import { getAllActiveCategories } from "@/lib/data/homepage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await getAllActiveCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("[categories] GET failed:", error);
    return NextResponse.json({ success: false, message: "Could not load categories." }, { status: 500 });
  }
}
