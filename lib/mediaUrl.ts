export function toServedImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("/uploads/")) {
    return `/api/images/${encodeURIComponent(url.slice("/uploads/".length))}`;
  }
  return url;
}
