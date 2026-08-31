import { MetadataRoute } from "next";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BUSINESS_CONFIG.url;

  // 1. Static Pages
  const staticRoutes = ["", "/about", "/reviews", "/contact", "/products", "/categories"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Fetch Real Categories from Database
  const dbCategories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true }
  });
  
  const categoryRoutes = dbCategories.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 3. Fetch Real Products from Database
  const dbProducts = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true }
  });

  const productRoutes = dbProducts.map((prod) => ({
    url: `${baseUrl}/products/${prod.slug}`,
    lastModified: prod.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
