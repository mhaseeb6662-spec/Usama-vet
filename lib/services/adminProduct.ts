import crypto from "crypto";
import { prisma } from "@/lib/db";
import { createProductAlert, deleteProductAlertsForProduct } from "@/lib/services/productAlerts";

let productAdminSchemaReady = false;

function isIgnorableSchemaError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /duplicate|exists|already|check that column\/key exists|unknown table|does not exist/i.test(message);
}

function assertSafeIdent(value: string, label: string): string {
  if (!/^[A-Za-z0-9_]+$/.test(value)) {
    throw new Error(`${label} is not a valid database identifier.`);
  }
  return value;
}

async function foreignKeyNames(table: string, column: string): Promise<string[]> {
  const safeTable = assertSafeIdent(table, "Table");
  const safeColumn = assertSafeIdent(column, "Column");
  const rows = await prisma.$queryRawUnsafe<Array<{ CONSTRAINT_NAME: string }>>(
    `SELECT CONSTRAINT_NAME
     FROM information_schema.KEY_COLUMN_USAGE
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = '${safeTable}'
       AND COLUMN_NAME = '${safeColumn}'
       AND REFERENCED_TABLE_NAME IS NOT NULL`
  );
  return rows
    .map((row) => row.CONSTRAINT_NAME)
    .filter((name) => /^[A-Za-z0-9_]+$/.test(name));
}

async function replaceForeignKey(
  table: string,
  column: string,
  constraint: string,
  referencedTable: string,
  onDelete: "CASCADE" | "SET NULL"
) {
  const safeTable = assertSafeIdent(table, "Table");
  const safeColumn = assertSafeIdent(column, "Column");
  const safeConstraint = assertSafeIdent(constraint, "Constraint");
  const safeReferenced = assertSafeIdent(referencedTable, "Referenced table");

  const names = await foreignKeyNames(safeTable, safeColumn);
  for (const name of names) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE \`${safeTable}\` DROP FOREIGN KEY \`${name}\``);
    } catch (error) {
      if (!isIgnorableSchemaError(error)) {
        throw error;
      }
    }
  }

  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE \`${safeTable}\` ADD CONSTRAINT \`${safeConstraint}\` FOREIGN KEY (\`${safeColumn}\`) REFERENCES \`${safeReferenced}\`(\`id\`) ON DELETE ${onDelete} ON UPDATE CASCADE`
    );
  } catch (error) {
    if (!isIgnorableSchemaError(error)) {
      throw error;
    }
  }
}

async function runOptionalSchemaFix(statement: string) {
  try {
    await prisma.$executeRawUnsafe(statement);
  } catch (error) {
    if (!isIgnorableSchemaError(error)) {
      throw error;
    }
  }
}

export async function ensureProductAdminSchema(): Promise<void> {
  if (productAdminSchemaReady) {
    return;
  }

  await runOptionalSchemaFix(
    "UPDATE `Product` LEFT JOIN `Category` ON `Product`.`categoryId` = `Category`.`id` SET `Product`.`categoryId` = NULL WHERE `Product`.`categoryId` IS NOT NULL AND `Category`.`id` IS NULL"
  );
  await runOptionalSchemaFix(
    "DELETE `ProductImage` FROM `ProductImage` LEFT JOIN `Product` ON `ProductImage`.`productId` = `Product`.`id` WHERE `Product`.`id` IS NULL"
  );
  await runOptionalSchemaFix(
    "UPDATE `Review` LEFT JOIN `Product` ON `Review`.`productId` = `Product`.`id` SET `Review`.`productId` = NULL WHERE `Review`.`productId` IS NOT NULL AND `Product`.`id` IS NULL"
  );
  await runOptionalSchemaFix(
    "DELETE `ProductAlert` FROM `ProductAlert` LEFT JOIN `Product` ON `ProductAlert`.`productId` = `Product`.`id` WHERE `Product`.`id` IS NULL"
  );

  await replaceForeignKey("Product", "categoryId", "Product_categoryId_fkey", "Category", "SET NULL");
  await replaceForeignKey("ProductImage", "productId", "ProductImage_productId_fkey", "Product", "CASCADE");
  await replaceForeignKey("Review", "productId", "Review_productId_fkey", "Product", "SET NULL");
  await replaceForeignKey("ProductAlert", "productId", "ProductAlert_productId_fkey", "Product", "CASCADE");
  productAdminSchemaReady = true;
}

export async function resolveOptionalCategoryId(raw: string): Promise<number | null> {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  const id = Number.parseInt(trimmed, 10);
  if (Number.isNaN(id)) {
    throw new Error("Category is invalid.");
  }
  const category = await prisma.category.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!category) {
    throw new Error("Selected category was not found.");
  }
  return category.id;
}

function productSlug(name: string, sku: string): string {
  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (slug.length < 3) {
    slug = `${slug}-${sku}`.replace(/^-+|-+$/g, "");
  }
  return slug;
}

function readProductFields(formData: FormData, options: { requireSku: boolean }) {
  const name = String(formData.get("name") || "").trim();
  const sku = String(formData.get("sku") || "").trim();
  const shortDescription = String(formData.get("shortDescription") || "");
  const description = String(formData.get("description") || "");
  const primaryImage = String(formData.get("primaryImage") || "").trim();
  const price = Number.parseFloat(String(formData.get("price") || ""));
  const salePriceRaw = String(formData.get("salePrice") || "").trim();
  const salePrice = salePriceRaw ? Number.parseFloat(salePriceRaw) : null;
  const stockQuantity = Number.parseInt(String(formData.get("stockQuantity") || ""), 10);
  const categoryIdStr = String(formData.get("categoryId") || "");

  if (!name) {
    throw new Error("Product name is required.");
  }
  if (options.requireSku && !sku) {
    throw new Error("SKU is required.");
  }
  if (Number.isNaN(price)) {
    throw new Error("Regular price is required.");
  }
  if (salePriceRaw && Number.isNaN(salePrice)) {
    throw new Error("Sale price must be a valid number.");
  }
  if (Number.isNaN(stockQuantity)) {
    throw new Error("Stock quantity is required.");
  }

  return {
    name,
    sku,
    shortDescription,
    description,
    primaryImage,
    price,
    salePrice,
    stockQuantity,
    categoryIdStr,
    isFeatured: formData.get("isFeatured") === "on",
    isNewArrival: formData.get("isNewArrival") === "on",
    isBestSeller: formData.get("isBestSeller") === "on",
    isRecommended: formData.get("isRecommended") === "on",
    isTrending: formData.get("isTrending") === "on",
    seoTitle: String(formData.get("seoTitle") || ""),
    metaDescription: String(formData.get("metaDescription") || ""),
  };
}

export async function createAdminProduct(formData: FormData) {
  await ensureProductAdminSchema();
  const fields = readProductFields(formData, { requireSku: false });
  const sku = fields.sku || crypto.randomBytes(4).toString("hex").toUpperCase();
  const categoryId = await resolveOptionalCategoryId(fields.categoryIdStr);

  const skuClash = await prisma.product.findFirst({
    where: { sku },
    select: { id: true },
  });
  if (skuClash) {
    throw new Error("Another product already uses this SKU.");
  }

  let slug = productSlug(fields.name, sku);
  const slugClash = await prisma.product.findFirst({
    where: { slug },
    select: { id: true },
  });
  if (slugClash) {
    slug = `${slug}-${sku}`.replace(/^-+|-+$/g, "");
  }

  const product = await prisma.product.create({
    data: {
      name: fields.name,
      slug,
      sku,
      shortDescription: fields.shortDescription,
      description: fields.description,
      price: fields.price,
      salePrice: fields.salePrice,
      stockQuantity: fields.stockQuantity,
      categoryId,
      isFeatured: fields.isFeatured,
      isNewArrival: fields.isNewArrival,
      isBestSeller: fields.isBestSeller,
      isRecommended: fields.isRecommended,
      isTrending: fields.isTrending,
      seoTitle: fields.seoTitle,
      metaDescription: fields.metaDescription,
      ...(fields.primaryImage
        ? {
            images: {
              create: [{ imageUrl: fields.primaryImage, isPrimary: true, sortOrder: 0 }],
            },
          }
        : {}),
    },
  });

  try {
    await createProductAlert(product.id, "NEW", product.name);
  } catch (error) {
    console.error("[admin] Product saved but alert failed:", error);
  }

  return product;
}

export async function updateAdminProduct(formData: FormData) {
  await ensureProductAdminSchema();
  const id = Number.parseInt(String(formData.get("id") || ""), 10);
  if (Number.isNaN(id)) {
    throw new Error("Product id is required to update.");
  }

  const existing = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) {
    throw new Error("Product was not found.");
  }

  const fields = readProductFields(formData, { requireSku: true });
  const categoryId = await resolveOptionalCategoryId(fields.categoryIdStr);

  const skuClash = await prisma.product.findFirst({
    where: { sku: fields.sku, NOT: { id } },
    select: { id: true },
  });
  if (skuClash) {
    throw new Error("Another product already uses this SKU.");
  }

  let slug = existing.slug;
  if (fields.name !== existing.name) {
    const nextSlug = productSlug(fields.name, fields.sku);
    const slugClash = await prisma.product.findFirst({
      where: { slug: nextSlug, NOT: { id } },
      select: { id: true },
    });
    slug = slugClash ? `${nextSlug}-${id}` : nextSlug;
  }

  await prisma.product.update({
    where: { id },
    data: {
      name: fields.name,
      slug,
      sku: fields.sku,
      shortDescription: fields.shortDescription,
      description: fields.description,
      price: fields.price,
      salePrice: fields.salePrice,
      stockQuantity: fields.stockQuantity,
      categoryId,
      isFeatured: fields.isFeatured,
      isNewArrival: fields.isNewArrival,
      isBestSeller: fields.isBestSeller,
      isRecommended: fields.isRecommended,
      isTrending: fields.isTrending,
      seoTitle: fields.seoTitle,
      metaDescription: fields.metaDescription,
    },
  });

  const existingPrimary = existing.images.find((image) => image.isPrimary) || existing.images[0] || null;
  if (fields.primaryImage) {
    if (existingPrimary) {
      if (existingPrimary.imageUrl !== fields.primaryImage) {
        await prisma.productImage.update({
          where: { id: existingPrimary.id },
          data: { imageUrl: fields.primaryImage, isPrimary: true },
        });
      }
    } else {
      await prisma.productImage.create({
        data: {
          productId: id,
          imageUrl: fields.primaryImage,
          isPrimary: true,
          sortOrder: 0,
        },
      });
    }
  } else if (existingPrimary) {
    await prisma.productImage.delete({ where: { id: existingPrimary.id } });
  }

  try {
    await createProductAlert(id, "UPDATED", fields.name);
  } catch (error) {
    console.error("[admin] Product updated but alert failed:", error);
  }
}

export async function deleteAdminProduct(id: number) {
  await ensureProductAdminSchema();
  const existing = await prisma.product.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    throw new Error("Product was not found.");
  }

  const orderCount = await prisma.orderItem.count({ where: { productId: id } });
  if (orderCount > 0) {
    throw new Error(`This product is on ${orderCount} order(s) and cannot be deleted.`);
  }

  await deleteProductAlertsForProduct(id);
  await prisma.productImage.deleteMany({ where: { productId: id } });
  await prisma.review.updateMany({
    where: { productId: id },
    data: { productId: null },
  });
  await prisma.product.delete({ where: { id } });
}
