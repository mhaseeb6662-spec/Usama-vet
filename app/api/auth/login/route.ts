import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { password } = await request.json();
  
  // Use environment variable in production, fallback for testing
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123";

  if (password === ADMIN_PASS) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authorized', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
}
