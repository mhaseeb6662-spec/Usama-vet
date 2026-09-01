import { NextResponse } from "next/server";
import { getAuthenticatedCustomer, publicCustomerFromUser } from "@/lib/services/customerAuth";
import { getUnreadAlertCount } from "@/lib/services/productAlerts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getAuthenticatedCustomer();
    if (!user) {
      return NextResponse.json({ success: false, message: "Please log in to continue." }, { status: 401 });
    }

    const unreadAlerts = await getUnreadAlertCount(user);
    return NextResponse.json({
      success: true,
      data: {
        ...publicCustomerFromUser(user),
        unreadAlerts,
      },
    });
  } catch (error) {
    console.error("[account] me failed:", error);
    return NextResponse.json({ success: false, message: "Could not load your account." }, { status: 500 });
  }
}
