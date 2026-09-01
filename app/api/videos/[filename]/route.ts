import { NextRequest, NextResponse } from "next/server";
import { createReadStream, statSync } from "fs";
import { Readable } from "stream";
import path from "path";
import { resolveUploadedFile } from "@/lib/uploadPath";

function videoContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".webm") return "video/webm";
  if (ext === ".mov") return "video/quicktime";
  return "video/mp4";
}

function resolveVideoPath(filename: string): string | null {
  return resolveUploadedFile(path.basename(filename));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const filePath = resolveVideoPath(filename);

    if (!filePath) {
      return new NextResponse("Video not found", { status: 404 });
    }

    const stat = statSync(filePath);
    const contentType = videoContentType(filePath);
    const range = request.headers.get("range");

    if (range) {
      const match = range.match(/bytes=(\d+)-(\d*)/);
      if (!match) {
        return new NextResponse("Invalid range", { status: 416 });
      }

      const start = Number.parseInt(match[1], 10);
      const end = match[2] ? Number.parseInt(match[2], 10) : Math.min(start + 1024 * 1024 - 1, stat.size - 1);

      if (Number.isNaN(start) || Number.isNaN(end) || start < 0 || end >= stat.size || start > end) {
        return new NextResponse("Invalid range", {
          status: 416,
          headers: { "Content-Range": `bytes */${stat.size}` },
        });
      }

      const stream = createReadStream(filePath, { start, end });
      return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(end - start + 1),
          "Content-Range": `bytes ${start}-${end}/${stat.size}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const stream = createReadStream(filePath);
    return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(stat.size),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[videos] Failed to read upload:", error);
    return new NextResponse("Error reading video", { status: 500 });
  }
}
