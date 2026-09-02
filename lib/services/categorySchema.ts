import { prisma } from "@/lib/db";
import { isMissingTableError } from "@/lib/services/productAlerts";

let schemaReady = false;

function isIgnorableSchemaError(error: unknown): boolean {
  if (isMissingTableError(error)) {
    return true;
  }
  const message = error instanceof Error ? error.message : String(error);
  return /duplicate|already|check that column\/key exists/i.test(message);
}

function assertSafeIdent(value: string, label: string): string {
  if (!/^[A-Za-z0-9_]+$/.test(value)) {
    throw new Error(`${label} is not a valid database identifier.`);
  }
  return value;
}

async function tableExists(table: string): Promise<boolean> {
  const safeTable = assertSafeIdent(table, "Table");
  const rows = await prisma.$queryRawUnsafe<Array<{ c: number | bigint }>>(
    `SELECT COUNT(*) AS c
     FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = '${safeTable}'`
  );
  return Number(rows[0]?.c || 0) > 0;
}

async function columnExists(table: string, column: string): Promise<boolean> {
  const safeTable = assertSafeIdent(table, "Table");
  const safeColumn = assertSafeIdent(column, "Column");
  const rows = await prisma.$queryRawUnsafe<Array<{ c: number | bigint }>>(
    `SELECT COUNT(*) AS c
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = '${safeTable}'
       AND COLUMN_NAME = '${safeColumn}'`
  );
  return Number(rows[0]?.c || 0) > 0;
}

async function addColumnIfMissing(table: string, column: string, definition: string) {
  if (await columnExists(table, column)) {
    return;
  }
  const safeTable = assertSafeIdent(table, "Table");
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE \`${safeTable}\` ADD COLUMN ${definition}`);
  } catch (error) {
    if (!isIgnorableSchemaError(error)) {
      throw error;
    }
  }
}

export async function ensureCategorySchema(): Promise<void> {
  if (schemaReady) {
    return;
  }

  if (!(await tableExists("Category"))) {
    throw new Error("Category table is missing.");
  }

  await addColumnIfMissing("Category", "image", "`image` VARCHAR(191) NULL");
  await addColumnIfMissing("Category", "showOnHomepage", "`showOnHomepage` BOOLEAN NOT NULL DEFAULT false");
  schemaReady = true;
}
