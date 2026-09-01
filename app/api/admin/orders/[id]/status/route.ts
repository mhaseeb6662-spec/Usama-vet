import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { ORDER_STATUSES } from "@/lib/constants/checkout";
import { OrderApplicationError, updateOrderStatus } from "@/lib/services/orders";

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
    const status = body.status;
    if (!ORDER_STATUSES.includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid order status." }, { status: 400 });
    }

    const order = await updateOrderStatus(orderId, status);
    return NextResponse.json({ success: true, data: { id: order.id, status: order.status } });
  } catch (error) {
    if (error instanceof OrderApplicationError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
    }
    console.error("[admin orders] status update failed:", error);
    return NextResponse.json({ success: false, message: "Could not update order status." }, { status: 500 });
  }
}
