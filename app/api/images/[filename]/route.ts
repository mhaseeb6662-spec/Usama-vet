import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import fs from "fs";
import { getLegacyUploadDir, getUploadDir } from "@/lib/uploadPath";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Normalize path to prevent directory traversal
    const safeFilename = path.basename(filename);
    const candidates = [
      path.join(getUploadDir(), safeFilename),
      path.join(getLegacyUploadDir(), safeFilename),
    ];
    const filePath = candidates.find((candidate) => fs.existsSync(candidate));

    if (!filePath) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const file = await readFile(filePath);
    
    // Determine content type based on extension
    const ext = path.extname(safeFilename).toLowerCase();
    let contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".gif") contentType = "image/gif";
    else if (ext === ".svg") contentType = "image/svg+xml";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[images] Failed to read upload:", error);
    return new NextResponse("Error reading image", { status: 500 });
  }
}
