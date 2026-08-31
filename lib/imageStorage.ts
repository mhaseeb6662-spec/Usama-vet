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
  const filePath = path.join(process.cwd(), UPLOAD_DIR, uniqueName);

  // You should ideally check if UPLOAD_DIR exists and create it using `mkdir` here.
  // For simplicity, we assume `public/uploads` exists or will be created by a setup script.
  await writeFile(filePath, buffer);

  // Return the public URL path
  return `/uploads/${uniqueName}`;
}

export async function deleteImage(imageUrl: string): Promise<void> {
  if (!imageUrl.startsWith("/uploads/")) {
    return; // Don't delete if it's an external URL or default placeholder
  }

  const filename = imageUrl.replace("/uploads/", "");
  const filePath = path.join(process.cwd(), UPLOAD_DIR, filename);

  try {
    await unlink(filePath);
  } catch (error) {
    console.error("Error deleting image:", error);
    // Ignore error if file doesn't exist
  }
}
