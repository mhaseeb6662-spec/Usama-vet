import { NextResponse } from "next/server";
import { logoutCustomer } from "@/lib/customerSession";

export const dynamic = "force-dynamic";

export async function POST() {
  await logoutCustomer();
  return NextResponse.json({ success: true });
}
