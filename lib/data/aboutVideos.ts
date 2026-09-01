import { cache } from "react";
import { prisma } from "@/lib/db";

export type AboutVideoItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
};

const CREATE_ABOUT_VIDEO_TABLE = `
CREATE TABLE IF NOT EXISTS \`AboutVideo\` (
  \`id\` INTEGER NOT NULL AUTO_INCREMENT,
  \`title\` VARCHAR(191) NOT NULL,
  \`description\` VARCHAR(500) NULL,
  \`videoUrl\` VARCHAR(500) NOT NULL,
  \`embedUrl\` VARCHAR(500) NOT NULL,
  \`thumbnail\` VARCHAR(500) NOT NULL,
  \`sortOrder\` INTEGER NOT NULL DEFAULT 0,
  \`isActive\` BOOLEAN NOT NULL DEFAULT true,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL,
  PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
`;

export async function ensureAboutVideoTable(): Promise<void> {
  await prisma.$executeRawUnsafe(CREATE_ABOUT_VIDEO_TABLE);
}

export const getAboutVideos = cache(async (): Promise<AboutVideoItem[]> => {
  try {
    await ensureAboutVideoTable();
    const videos = await prisma.aboutVideo.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return videos.map((video) => ({
      id: String(video.id),
      title: video.title,
      description: video.description || "",
      url: video.videoUrl || video.embedUrl,
      thumbnail: video.thumbnail || "",
    }));
  } catch (error) {
    console.error("[DB] getAboutVideos failed:", error);
    return [];
  }
});
