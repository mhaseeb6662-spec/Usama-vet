import { NextResponse } from "next/server";
import { SearchApplicationError, searchProducts } from "@/lib/services/productSearch";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const products = await searchProducts(searchParams.get("q") || "", 8);
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    if (error instanceof SearchApplicationError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
    }
    console.error("[search] GET failed:", error);
    return NextResponse.json({ success: false, message: "Could not search products. Please try again." }, { status: 500 });
  }
}
