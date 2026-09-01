import { NextResponse } from "next/server";
import { cartQuoteSchema } from "@/lib/validators/order";
import { quoteCartItems } from "@/lib/services/cartQuote";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = cartQuoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid cart." },
        { status: 400 }
      );
    }

    const quote = await quoteCartItems(parsed.data.items);
    return NextResponse.json({ success: true, data: quote });
  } catch (error) {
    console.error("[cart] quote failed:", error);
    return NextResponse.json(
      { success: false, message: "Could not load cart prices. Please try again." },
      { status: 500 }
    );
  }
}
