import { MetadataRoute } from "next";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/data/mockData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BUSINESS_CONFIG.url;

  // 1. Static Pages
  const staticRoutes = ["", "/about", "/reviews", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Future Dynamic Category Pages
  const categoryRoutes = MOCK_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 3. Future Dynamic Product Pages
  const productRoutes = MOCK_PRODUCTS.map((prod) => ({
    url: `${baseUrl}/products/${prod.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
