import { writeFile, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Ensure this matches the relative path to your public uploads folder
const UPLOAD_DIR = process.env.UPLOAD_DIR || "./public/uploads";

export async function uploadImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validate type
  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid file type. Only images are allowed.");
  }

  // Generate unique filename
  const extension = path.extname(file.name) || ".jpg";
  const uniqueName = crypto.randomBytes(16).toString("hex") + extension;
  
  const uploadPath = path.join(process.cwd(), UPLOAD_DIR);
  const filePath = path.join(uploadPath, uniqueName);

  // Ensure directory exists
  try {
    await require("fs/promises").mkdir(uploadPath, { recursive: true });
  } catch (err) {
    // Ignore if exists
  }

  await writeFile(filePath, buffer);

  // Return the public URL path served by the image API so Hostinger deploys keep working
  return `/api/images/${uniqueName}`;
}

export async function deleteImage(imageUrl: string): Promise<void> {
  let filename: string | null = null;
  if (imageUrl.startsWith("/uploads/")) {
    filename = imageUrl.slice("/uploads/".length);
  } else if (imageUrl.startsWith("/api/images/")) {
    filename = decodeURIComponent(imageUrl.slice("/api/images/".length));
  }
  if (!filename) {
    return;
  }

  const filePath = path.join(process.cwd(), UPLOAD_DIR, filename);

  try {
    await unlink(filePath);
  } catch (error) {
    console.error("Error deleting image:", error);
    // Ignore error if file doesn't exist
  }
}
