import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { toServedImageUrl } from "@/lib/mediaUrl";

export type HowToOrderPostItem = {
  id: number;
  image: string;
};

const CREATE_HOW_TO_ORDER_POST_TABLE = `
CREATE TABLE IF NOT EXISTS \`HowToOrderPost\` (
  \`id\` INTEGER NOT NULL AUTO_INCREMENT,
  \`title\` VARCHAR(191) NULL,
  \`body\` TEXT NULL,
  \`image\` VARCHAR(500) NULL,
  \`sortOrder\` INTEGER NOT NULL DEFAULT 0,
  \`isActive\` BOOLEAN NOT NULL DEFAULT true,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL,
  PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
`;

export async function ensureHowToOrderPostTable(): Promise<void> {
  await prisma.$executeRawUnsafe(CREATE_HOW_TO_ORDER_POST_TABLE);
}

function isMissingTable(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021";
}

export async function getActiveHowToOrderPosts(): Promise<HowToOrderPostItem[]> {
  try {
    const posts = await prisma.howToOrderPost.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return posts
      .map((post) => ({
        id: post.id,
        image: toServedImageUrl(post.image),
      }))
      .filter((post) => Boolean(post.image));
  } catch (error) {
    if (isMissingTable(error)) {
      return [];
    }
    throw error;
  }
}
