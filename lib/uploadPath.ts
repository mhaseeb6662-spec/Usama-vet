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

function getDomainRoot(): string | null {
  const cwd = process.cwd();
  const parts = path.resolve(cwd).split(path.sep);
  
  let index = parts.lastIndexOf("hbuilds");
  if (index <= 0) {
    index = parts.lastIndexOf("public_html");
  }
  
  if (index > 0) {
    return parts.slice(0, index).join(path.sep);
  }
  
  return null;
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

  const domainRoot = getDomainRoot();
  if (domainRoot) {
    return path.join(domainRoot, "persistent-uploads");
  }

  // Bulletproof fallback: use the user's home directory
  try {
    const os = require("os");
    const homeDir = os.homedir();
    if (homeDir && fs.existsSync(homeDir)) {
      return path.join(homeDir, "usamavet-persistent-uploads");
    }
  } catch (e) {
    // ignore
  }

  // If all else fails, store it one level above the current working directory
  // so that git pulls/deployments inside cwd do not wipe it.
  return path.resolve(process.cwd(), "..", "usamavet-persistent-uploads");
}

export function getLegacyUploadDir(): string {
  return path.resolve(process.cwd(), "public", "uploads");
}

export function getUploadLookupDirs(): string[] {
  const cwd = process.cwd();
  const domainRoot = getDomainRoot();
  
  let homeUploads = "";
  try {
    const os = require("os");
    homeUploads = path.join(os.homedir(), "usamavet-persistent-uploads");
  } catch (e) {
    // ignore
  }

  return uniqueDirs([
    getUploadDir(),
    ...(homeUploads ? [homeUploads] : []),
    path.resolve(cwd, "..", "usamavet-persistent-uploads"),
    path.resolve(cwd, "..", "persistent-uploads"),
    path.resolve(cwd, "..", "..", "persistent-uploads"),
    path.resolve(cwd, "public", "uploads"),
    getLegacyUploadDir(),
    ...(domainRoot
      ? [
          path.join(domainRoot, "hbuilds", "current", "persistent-uploads"),
          path.join(domainRoot, "hbuilds", "current", "nodejs", "persistent-uploads"),
          path.join(domainRoot, "hbuilds", "current", "nodejs", "public", "uploads"),
          path.join(domainRoot, "persistent-uploads"),
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
