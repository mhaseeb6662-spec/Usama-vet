import crypto from "crypto";
import { prisma } from "@/lib/db";
import {
  createProductAlert,
  deleteProductAlertsForProduct,
  isMissingTableError,
} from "@/lib/services/productAlerts";

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

async function detachOrderItems(productId: number) {
  try {
    await prisma.$executeRawUnsafe(
      `UPDATE \`OrderItem\` SET \`productId\` = NULL WHERE \`productId\` = ${productId}`
    );
  } catch (error) {
    if (!isMissingTableError(error)) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/null|cannot|1146|1364|1048/i.test(message)) {
        throw error;
      }
    }
  }
}

function isForeignKeyError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return false;
  }
  return String((error as { code?: unknown }).code || "") === "P2003";
}

export async function deleteAdminProduct(id: number) {
  const existing = await prisma.product.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    throw new Error("Product was not found.");
  }

  await deleteProductAlertsForProduct(id);
  try {
    await prisma.productImage.deleteMany({ where: { productId: id } });
  } catch (error) {
    if (!isMissingTableError(error)) {
      throw error;
    }
  }
  try {
    await prisma.review.updateMany({
      where: { productId: id },
      data: { productId: null },
    });
  } catch (error) {
    if (!isMissingTableError(error)) {
      throw error;
    }
  }

  try {
    await prisma.product.delete({ where: { id } });
    return;
  } catch (error) {
    if (!isForeignKeyError(error)) {
      throw error;
    }
    await detachOrderItems(id);
    try {
      await prisma.product.delete({ where: { id } });
    } catch (retryError) {
      throw new Error("This product is on existing orders and cannot be deleted.", {
        cause: retryError,
      });
    }
  }
}
