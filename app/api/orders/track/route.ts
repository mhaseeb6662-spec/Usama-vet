import { NextResponse } from "next/server";
import { OrderApplicationError, trackOrder } from "@/lib/services/orders";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await trackOrder(body);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof OrderApplicationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }
    console.error("[orders] track failed:", error);
    return NextResponse.json(
      { success: false, message: "Could not look up that order." },
      { status: 500 }
    );
  }
}
