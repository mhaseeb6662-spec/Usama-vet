import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE Product ADD COLUMN videoUrl VARCHAR(500) NULL;`);
    return NextResponse.json({ success: true, message: "Added videoUrl column to Product table." });
  } catch (err: any) {
    if (err.message.includes("Duplicate column name")) {
      return NextResponse.json({ success: true, message: "Column already exists." });
    }
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
