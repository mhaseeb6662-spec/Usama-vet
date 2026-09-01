import fs from "fs";
import path from "path";

function uniqueDirs(dirs: string[]): string[] {
  const seen = new Set<string>();
  const resolved: string[] = [];
  for (const dir of dirs) {
    const absolute = path.resolve(dir);
    if (!seen.has(absolute)) {
      seen.add(absolute);
      resolved.push(absolute);
    }
  }
  return resolved;
}

function getHostingerDomainRoot(): string | null {
  const parts = path.resolve(process.cwd()).split(path.sep);
  const index = parts.lastIndexOf("hbuilds");
  if (index <= 0) {
    return null;
  }
  return parts.slice(0, index).join(path.sep);
}

/**
 * Hostinger replaces hbuilds/current on every rebuild. Store uploads next to
 * the domain folder so Shop by Categories, products, and hero images survive.
 */
export function getUploadDir(): string {
  const configured = process.env.UPLOAD_DIR?.trim();
  if (configured) {
    return path.isAbsolute(configured)
      ? configured
      : path.resolve(process.cwd(), configured);
  }

  const domainRoot = getHostingerDomainRoot();
  if (domainRoot) {
    return path.join(domainRoot, "persistent-uploads");
  }

  return path.resolve(process.cwd(), "public", "uploads");
}

export function getLegacyUploadDir(): string {
  return path.resolve(process.cwd(), "public", "uploads");
}

export function getUploadLookupDirs(): string[] {
  const cwd = process.cwd();
  const domainRoot = getHostingerDomainRoot();
  return uniqueDirs([
    getUploadDir(),
    path.resolve(cwd, "..", "persistent-uploads"),
    path.resolve(cwd, "..", "..", "persistent-uploads"),
    path.resolve(cwd, "public", "uploads"),
    getLegacyUploadDir(),
    ...(domainRoot
      ? [
          path.join(domainRoot, "hbuilds", "current", "persistent-uploads"),
          path.join(domainRoot, "hbuilds", "current", "nodejs", "persistent-uploads"),
          path.join(domainRoot, "hbuilds", "current", "nodejs", "public", "uploads"),
        ]
      : []),
  ]);
}

export function resolveUploadedFile(filename: string): string | null {
  const safeFilename = path.basename(filename);
  for (const dir of getUploadLookupDirs()) {
    const candidate = path.join(dir, safeFilename);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}
