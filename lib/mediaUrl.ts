export function toServedImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("/uploads/")) {
    return `/api/images/${encodeURIComponent(url.slice("/uploads/".length))}`;
  }
  return url;
}

export function isPersistentPublicImage(url: string | null | undefined): boolean {
  if (!url) return false;
  if (url.startsWith("/uploads/")) return false;
  return (
    url.startsWith("/images/") ||
    url.startsWith("/api/images/") ||
    url.startsWith("https://")
  );
}
