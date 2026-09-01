import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // Basic security check (requires ?secret=usama to run)
  if (secret !== "usama") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Prisma db push handled collections.
    // 2. Create the Super Admin user
    const email = "admin@usamavet.com";
    const password = "admin";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
      await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          name: "Super Admin",
          role: "SUPER_ADMIN",
          status: "ACTIVE"
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database schema updated and Super Admin created successfully!",
      adminEmail: email,
      adminPassword: password
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stdout: error.stdout ? error.stdout.toString() : null,
      stderr: error.stderr ? error.stderr.toString() : null
    }, { status: 500 });
  }
}
