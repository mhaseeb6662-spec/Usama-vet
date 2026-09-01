import { prisma } from "@/lib/db";

const STATEMENTS = [
  "ALTER TABLE `Category` ADD COLUMN `showOnHomepage` BOOLEAN NOT NULL DEFAULT false",
];

let schemaReady = false;

export async function ensureCategorySchema(): Promise<void> {
  if (schemaReady) return;

  let failed = false;
  for (const statement of STATEMENTS) {
    try {
      await prisma.$executeRawUnsafe(statement);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/duplicate|exists|already/i.test(message)) {
        console.error("[categories] Schema statement failed:", statement, error);
        failed = true;
      }
    }
  }
  if (!failed) {
    schemaReady = true;
  }
}
