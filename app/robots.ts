import { MetadataRoute } from "next";
import { BUSINESS_CONFIG } from "@/lib/constants/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = BUSINESS_CONFIG.url;

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/reviews", "/contact", "/products/", "/categories/"],
      disallow: [
        "/cart",
        "/checkout",
        "/account",
        "/admin",
        "/*?q=", // Disallow search query result crawling to prevent duplicate pages
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
