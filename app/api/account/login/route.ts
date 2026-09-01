import { NextResponse } from "next/server";
import { AccountApplicationError, loginCustomer } from "@/lib/services/customerAuth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer = await loginCustomer(body);
    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    if (error instanceof AccountApplicationError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
    }
    console.error("[account] login failed:", error);
    return NextResponse.json({ success: false, message: "Could not log you in. Please try again." }, { status: 500 });
  }
}
