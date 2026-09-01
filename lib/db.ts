import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function withMysqlPoolLimits(url: string): string {
  if (
    url.includes("connection_limit=") &&
    url.includes("connect_timeout=") &&
    url.includes("pool_timeout=")
  ) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  const extras: string[] = [];
  if (!url.includes("connection_limit=")) extras.push("connection_limit=5");
  if (!url.includes("connect_timeout=")) extras.push("connect_timeout=5");
  if (!url.includes("pool_timeout=")) extras.push("pool_timeout=8");
  return extras.length === 0 ? url : `${url}${separator}${extras.join("&")}`;
}

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    ...(url
      ? {
          datasources: {
            db: {
              url: withMysqlPoolLimits(url),
            },
          },
        }
      : {}),
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;

/**
 * Safe wrapper for Prisma queries - catches connection errors gracefully
 * instead of crashing the whole page with 500.
 */
export async function safeQuery<T>(queryFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await queryFn();
  } catch (error) {
    console.error("[DB] Query failed:", error);
    return fallback;
  }
}
