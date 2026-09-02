import crypto from "crypto";
import { prisma } from "@/lib/db";
import { ensureCategorySchema } from "@/lib/services/categorySchema";
import { isMissingTableError } from "@/lib/services/productAlerts";

function categorySlug(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug || `category-${crypto.randomBytes(3).toString("hex")}`;
}

function readCategoryFields(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const image = String(formData.get("image") || "").trim();
  const showOnHomepage = formData.get("showOnHomepage") === "on";

  if (!name) {
    throw new Error("Category name is required.");
  }
  if (description.length > 191) {
    throw new Error("Description must be 191 characters or less.");
  }
  if (showOnHomepage && !image) {
    throw new Error("Upload a category picture to show it in Shop by Categories.");
  }

  return { name, description, image, showOnHomepage };
}

export async function createAdminCategory(formData: FormData) {
  await ensureCategorySchema();
  const { name, description, image, showOnHomepage } = readCategoryFields(formData);
  const slugBase = categorySlug(name);
  const clash = await prisma.category.findFirst({
    where: { slug: slugBase },
    select: { id: true },
  });
  if (clash) {
    throw new Error("A category with this name already exists.");
  }

  return prisma.category.create({
    data: {
      name,
      slug: slugBase,
      description: description || null,
      image: image || null,
      isActive: true,
      showOnHomepage,
    },
  });
}

export async function updateAdminCategory(formData: FormData) {
  await ensureCategorySchema();
  const id = Number.parseInt(String(formData.get("id") || ""), 10);
  if (Number.isNaN(id)) {
    throw new Error("Category id is required to update.");
  }

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Category was not found.");
  }

  const { name, description, image, showOnHomepage } = readCategoryFields(formData);

  let slug = existing.slug;
  if (name !== existing.name) {
    const nextSlug = categorySlug(name);
    const clash = await prisma.category.findFirst({
      where: { slug: nextSlug, NOT: { id } },
      select: { id: true },
    });
    slug = clash ? `${nextSlug}-${id}` : nextSlug;
  }

  return prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
      description: description || null,
      image: image || null,
      showOnHomepage,
    },
  });
}

export async function deleteAdminCategory(id: number) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Category was not found.");
  }

  try {
    const subcategoryCount = await prisma.subcategory.count({ where: { categoryId: id } });
    if (subcategoryCount > 0) {
      throw new Error("This category has subcategories and cannot be deleted.");
    }
  } catch (error) {
    if (!isMissingTableError(error)) {
      throw error;
    }
  }

  await prisma.product.updateMany({
    where: { categoryId: id },
    data: { categoryId: null },
  });

  try {
    await prisma.homepageSection.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });
  } catch (error) {
    if (!isMissingTableError(error)) {
      throw error;
    }
  }

  await prisma.category.delete({ where: { id } });
}

export async function toggleAdminCategoryHomepage(formData: FormData) {
  await ensureCategorySchema();
  const id = Number.parseInt(String(formData.get("id") || ""), 10);
  if (Number.isNaN(id)) {
    throw new Error("Category id is required to update homepage visibility.");
  }
  const currentlyVisible = formData.get("showOnHomepage") === "true";
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Category was not found.");
  }
  if (!currentlyVisible && !existing.image) {
    throw new Error("Upload a category picture before showing it in Shop by Categories.");
  }
  return prisma.category.update({
    where: { id },
    data: { showOnHomepage: !currentlyVisible },
  });
}
