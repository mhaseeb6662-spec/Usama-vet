import { Product as PrismaProduct, ProductImage, Category as PrismaCategory, Brand } from "@prisma/client";
import { Product as UIProduct, Category as UICategory } from "@/types";

type FullPrismaProduct = PrismaProduct & {
  images?: ProductImage[];
  category?: PrismaCategory | null;
  brand?: Brand | null;
};

export function mapProductToUI(p: FullPrismaProduct): UIProduct {
  // Sort images by sortOrder and find primary or first
  const sortedImages = p.images ? [...p.images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.sortOrder - b.sortOrder;
  }) : [];
  
  const imageUrls = sortedImages.map(img => img.imageUrl);
  if (imageUrls.length === 0) {
    imageUrls.push("/placeholder.png"); // fallback
  }

  return {
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    brand: p.brand?.name || "Generic",
    price: Number(p.salePrice || p.price || 0),
    oldPrice: p.salePrice ? Number(p.price) : undefined,
    currency: "Rs.",
    description: p.shortDescription || p.description || "",
    longDescription: p.description || "",
    categorySlug: p.category?.slug || "uncategorized",
    sku: p.sku || "",
    images: imageUrls,
    imageAlt: sortedImages[0]?.altText || p.name,
    inStock: (p.stockQuantity || 0) > 0,
    stockCount: Number(p.stockQuantity || 0),
    seoTitle: p.seoTitle || p.name,
    seoDescription: p.metaDescription || p.shortDescription || "",
  };
}

export function mapCategoryToUI(c: PrismaCategory): UICategory {
  return {
    id: String(c.id),
    slug: c.slug,
    name: c.name,
    description: c.description || "",
    image: c.image || "/placeholder.png",
    iconName: c.icon || "Package",
  };
}
