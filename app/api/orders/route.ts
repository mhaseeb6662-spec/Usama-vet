import { NextResponse } from "next/server";
import { OrderApplicationError, placeOrder } from "@/lib/services/orders";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await placeOrder(body);

    const response = NextResponse.json({
      success: true,
      data: { orderNumber: order.orderNumber },
    });
    response.cookies.set("order_receipt", order.orderNumber, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    if (error instanceof OrderApplicationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }
    console.error("[orders] POST failed:", error);
    return NextResponse.json(
      { success: false, message: "We couldn't place your order. Please try again." },
      { status: 500 }
    );
  }
}
