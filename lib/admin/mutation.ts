import { redirect } from "next/navigation";

const MAX_ERROR_QUERY_LENGTH = 280;

export function isNextRedirectError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("digest" in error)) {
    return false;
  }
  const digest = String((error as { digest?: unknown }).digest || "");
  return digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_NOT_FOUND");
}

function prismaActionMessage(error: unknown): string | null {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return null;
  }
  const code = String((error as { code?: unknown }).code || "");
  if (code === "P2002") {
    return "This value is already in use. Use a different name or SKU.";
  }
  if (code === "P2003") {
    return "This record is linked to other data and cannot be changed that way.";
  }
  if (code === "P2021" || code === "P2022") {
    return "The database table or column is missing. Open Admin setup and try again.";
  }
  return null;
}

export function adminActionMessage(error: unknown): string {
  const prismaMessage = prismaActionMessage(error);
  if (prismaMessage) {
    return prismaMessage;
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim().slice(0, MAX_ERROR_QUERY_LENGTH);
  }
  return "The change could not be saved.";
}

export function failAdminAction(path: string, error: unknown): never {
  console.error("[admin] Action failed:", error);
  const separator = path.includes("?") ? "&" : "?";
  redirect(`${path}${separator}error=${encodeURIComponent(adminActionMessage(error))}`);
}

export async function runAdminAction(path: string, work: () => Promise<void>): Promise<void> {
  try {
    await work();
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }
    failAdminAction(path, error);
  }
}
