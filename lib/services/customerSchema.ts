import { prisma } from "@/lib/db";

const STATEMENTS = [
  "ALTER TABLE `User` ADD COLUMN `city` VARCHAR(191) NULL",
  "ALTER TABLE `User` ADD COLUMN `area` VARCHAR(191) NULL",
  "ALTER TABLE `User` ADD COLUMN `address` VARCHAR(1000) NULL",
  "ALTER TABLE `User` ADD COLUMN `lastAlertSeenAt` DATETIME(3) NULL",
  `CREATE TABLE IF NOT EXISTS \`ProductAlert\` (
    \`id\` INTEGER NOT NULL AUTO_INCREMENT,
    \`productId\` INTEGER NOT NULL,
    \`kind\` VARCHAR(191) NOT NULL,
    \`title\` VARCHAR(191) NOT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX \`ProductAlert_productId_idx\` (\`productId\`),
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
];

let schemaReady = false;

export async function ensureCustomerSchema(): Promise<void> {
  if (schemaReady) return;

  let failed = false;
  for (const statement of STATEMENTS) {
    try {
      await prisma.$executeRawUnsafe(statement);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/duplicate|exists|already/i.test(message)) {
        console.error("[account] Schema statement failed:", statement, error);
        failed = true;
      }
    }
  }
  if (!failed) {
    schemaReady = true;
  }
}
