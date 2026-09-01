import path from "path";

/**
 * Hostinger rebuilds wipe the app folder (hbuilds). Keep uploads one level
 * above that directory so product/hero images survive deploys.
 */
export function getUploadDir(): string {
  const configured = process.env.UPLOAD_DIR?.trim();
  if (configured) {
    return path.isAbsolute(configured)
      ? configured
      : path.resolve(process.cwd(), configured);
  }

  if (process.env.NODE_ENV === "production") {
    return path.resolve(process.cwd(), "..", "persistent-uploads");
  }

  return path.resolve(process.cwd(), "public", "uploads");
}

export function getLegacyUploadDir(): string {
  return path.resolve(process.cwd(), "public", "uploads");
}
