"use server";

import { prisma } from "@/lib/db";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export async function loginAdmin(emailRaw: string, passwordRaw: string) {
  try {
    const { email, password } = loginSchema.parse({ email: emailRaw, password: passwordRaw });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.role !== "SUPER_ADMIN" || user.status !== "ACTIVE") {
      return { error: "Invalid credentials or unauthorized" };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValid) {
      return { error: "Invalid credentials" };
    }

    await createSession(user.id, user.role);
    
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Invalid input format" };
    }
    console.error("Login error:", error);
    return { error: "An unexpected error occurred" };
  }
}
