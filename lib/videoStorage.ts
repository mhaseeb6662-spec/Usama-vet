import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getUploadDir } from "@/lib/uploadPath";

const MAX_VIDEO_BYTES = 40 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export async function uploadVideo(file: File): Promise<string> {
  if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
    throw new Error("Only MP4, WEBM, or MOV videos are allowed.");
  }

  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error("Video is too large. Compress it under 40 MB.");
  }

  const extension = path.extname(file.name).toLowerCase() || ".mp4";
  const uniqueName = crypto.randomBytes(16).toString("hex") + extension;
  const uploadPath = getUploadDir();
  const filePath = path.join(uploadPath, uniqueName);

  await mkdir(uploadPath, { recursive: true });
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return `/api/videos/${uniqueName}`;
}

export async function deleteVideo(videoUrl: string): Promise<void> {
  let filename: string | null = null;
  if (videoUrl.startsWith("/api/videos/")) {
    filename = decodeURIComponent(videoUrl.slice("/api/videos/".length));
  }
  if (!filename) {
    return;
  }

  try {
    await unlink(path.join(getUploadDir(), filename));
  } catch (error) {
    console.error("Error deleting video:", error);
  }
}
