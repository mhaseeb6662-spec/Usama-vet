import { cookies } from "next/headers";
import { decrypt, encrypt } from "@/lib/session";

const COOKIE_NAME = "customer_session";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export type CustomerSessionPayload = {
  userId: number;
  role: "CUSTOMER";
  kind: "customer";
};

function cookieOptions(expires: Date) {
  return {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export async function createCustomerSession(userId: number) {
  const expires = new Date(Date.now() + THIRTY_DAYS_MS);
  const session = await encrypt({
    userId,
    role: "CUSTOMER",
    kind: "customer",
    expires,
  }, "30d");

  (await cookies()).set(COOKIE_NAME, session, cookieOptions(expires));
}

export async function getCustomerSession(): Promise<CustomerSessionPayload | null> {
  const session = (await cookies()).get(COOKIE_NAME)?.value;
  if (!session) return null;

  const payload = await decrypt(session);
  if (!payload || payload.kind !== "customer" || payload.role !== "CUSTOMER") {
    return null;
  }
  if (typeof payload.userId !== "number" || !Number.isInteger(payload.userId) || payload.userId < 1) {
    return null;
  }

  return {
    userId: payload.userId,
    role: "CUSTOMER",
    kind: "customer",
  };
}

export async function logoutCustomer() {
  (await cookies()).set(COOKIE_NAME, "", cookieOptions(new Date(0)));
}
