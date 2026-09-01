import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createCustomerSession, getCustomerSession } from "@/lib/customerSession";
import { ensureCustomerSchema } from "@/lib/services/customerSchema";
import {
  loginCustomerSchema,
  normalizePakistanPhone,
  registerCustomerSchema,
} from "@/lib/validators/account";

export class AccountApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "AccountApplicationError";
  }
}

export type PublicCustomer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  area: string | null;
  address: string | null;
};

function toPublicCustomer(user: {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  area: string | null;
  address: string | null;
}): PublicCustomer {
  return {
    id: user.id,
    name: user.name || "",
    email: user.email,
    phone: user.phone,
    city: user.city,
    area: user.area,
    address: user.address,
  };
}

export async function registerCustomer(raw: unknown): Promise<PublicCustomer> {
  await ensureCustomerSchema();
  const parsed = registerCustomerSchema.safeParse(raw);
  if (!parsed.success) {
    throw new AccountApplicationError(
      parsed.error.issues[0]?.message || "Please check your registration details.",
      400,
      parsed.error.flatten()
    );
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AccountApplicationError("An account with this email already exists.", 409);
  }

  const now = new Date();
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      phone: normalizePakistanPhone(parsed.data.phone),
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
      role: "CUSTOMER",
      status: "ACTIVE",
      lastAlertSeenAt: now,
    },
  });

  await createCustomerSession(user.id);
  return toPublicCustomer(user);
}

export async function loginCustomer(raw: unknown): Promise<PublicCustomer> {
  await ensureCustomerSchema();
  const parsed = loginCustomerSchema.safeParse(raw);
  if (!parsed.success) {
    throw new AccountApplicationError(
      parsed.error.issues[0]?.message || "Please check your login details.",
      400,
      parsed.error.flatten()
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (!user || user.role !== "CUSTOMER" || user.status !== "ACTIVE") {
    throw new AccountApplicationError("Invalid email or password.", 401);
  }

  const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!isValid) {
    throw new AccountApplicationError("Invalid email or password.", 401);
  }

  await createCustomerSession(user.id);
  return toPublicCustomer(user);
}

export async function getAuthenticatedCustomer() {
  const session = await getCustomerSession();
  if (!session) return null;

  await ensureCustomerSchema();
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  if (!user || user.role !== "CUSTOMER" || user.status !== "ACTIVE") {
    return null;
  }

  return user;
}

export async function requireAuthenticatedCustomer() {
  const user = await getAuthenticatedCustomer();
  if (!user) {
    throw new AccountApplicationError("Please log in to continue.", 401);
  }
  return user;
}

export async function updateCustomerShipping(
  customerId: number,
  input: {
    customerName: string;
    phone: string;
    city: string;
    area?: string;
    address: string;
  }
) {
  const user = await prisma.user.findUnique({ where: { id: customerId } });
  if (!user || user.role !== "CUSTOMER" || user.status !== "ACTIVE") {
    throw new AccountApplicationError("Your account session is invalid. Please log in again.", 401);
  }

  return prisma.user.update({
    where: { id: customerId },
    data: {
      name: input.customerName,
      phone: input.phone,
      city: input.city,
      area: input.area || null,
      address: input.address,
    },
  });
}

export function publicCustomerFromUser(user: {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  area: string | null;
  address: string | null;
}): PublicCustomer {
  return toPublicCustomer(user);
}
