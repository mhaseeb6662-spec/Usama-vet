import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { ORDER_PAYMENT_STATUSES } from "@/lib/constants/checkout";
import { OrderApplicationError, updatePaymentStatus } from "@/lib/services/orders";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const orderId = Number.parseInt(id, 10);
    if (Number.isNaN(orderId)) {
      return NextResponse.json({ success: false, message: "Invalid order id." }, { status: 400 });
    }

    const body = await request.json();
    const paymentStatus = body.paymentStatus;
    if (!ORDER_PAYMENT_STATUSES.includes(paymentStatus)) {
      return NextResponse.json({ success: false, message: "Invalid payment status." }, { status: 400 });
    }

    const order = await updatePaymentStatus(orderId, paymentStatus);
    return NextResponse.json({ success: true, data: { id: order.id, paymentStatus: order.paymentStatus } });
  } catch (error) {
    if (error instanceof OrderApplicationError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
    }
    console.error("[admin orders] payment update failed:", error);
    return NextResponse.json({ success: false, message: "Could not update payment status." }, { status: 500 });
  }
}
