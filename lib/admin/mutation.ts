import { redirect } from "next/navigation";

const MAX_ERROR_QUERY_LENGTH = 280;

export function isNextRedirectError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const digest = "digest" in error ? String((error as { digest?: unknown }).digest || "") : "";
  const code = "code" in error ? String((error as { code?: unknown }).code || "") : "";
  const message = error instanceof Error ? error.message : "";
  return (
    digest.startsWith("NEXT_REDIRECT") ||
    digest.startsWith("NEXT_NOT_FOUND") ||
    digest.includes("NEXT_REDIRECT") ||
    code === "NEXT_REDIRECT" ||
    code === "NEXT_NOT_FOUND" ||
    message.includes("NEXT_REDIRECT") ||
    message.includes("NEXT_NOT_FOUND")
  );
}

function prismaErrorCode(error: unknown): string {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return "";
  }
  const code = String((error as { code?: unknown }).code || "");
  return /^P\d{4}$/.test(code) ? code : "";
}

function prismaMetaText(error: unknown): string {
  if (!error || typeof error !== "object" || !("meta" in error)) {
    return "";
  }
  const meta = (error as { meta?: { field_name?: unknown; constraint?: unknown } }).meta;
  return String(meta?.field_name || meta?.constraint || "");
}

function prismaActionMessage(error: unknown): string | null {
  const code = prismaErrorCode(error);
  if (!code) {
    return null;
  }
  if (code === "P2002") {
    return "This value is already in use. Use a different name or SKU.";
  }
  if (code === "P2003") {
    const field = prismaMetaText(error);
    if (/orderitem/i.test(field)) {
      return "This product is on existing orders and cannot be deleted.";
    }
    if (/category/i.test(field)) {
      return "The selected category was not found.";
    }
    if (/productimage|image/i.test(field)) {
      return "The product picture could not be saved.";
    }
    if (error instanceof Error && error.message.trim()) {
      return error.message.trim().slice(0, MAX_ERROR_QUERY_LENGTH);
    }
    return "The database rejected this change because a related record is missing or still in use.";
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
