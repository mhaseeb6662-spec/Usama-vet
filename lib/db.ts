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
  if (!url.includes("connection_limit=")) extras.push("connection_limit=10");
  if (!url.includes("connect_timeout=")) extras.push("connect_timeout=8");
  if (!url.includes("pool_timeout=")) extras.push("pool_timeout=10");
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

export async function pingDatabase(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`;
}

export function isDatabaseConnectionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /P1001|P1002|P1008|P1017|can't reach|timed out|ECONNREFUSED|ECONNRESET|pool timeout/i.test(
    message
  );
}

export async function withDatabaseRetry<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!isDatabaseConnectionError(error)) {
      throw error;
    }
    console.error("[DB] First connection failed, retrying once:", error);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return operation();
  }
}

export async function safeQuery<T>(queryFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await queryFn();
  } catch (error) {
    console.error("[DB] Query failed:", error);
    return fallback;
  }
}
