import { MetadataRoute } from "next";
import { BUSINESS_CONFIG } from "@/lib/constants/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = BUSINESS_CONFIG.url;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/account",
        "/account/",
        "/cart",
        "/checkout",
        "/order-success",
        "/track-order",
        "/order-tracking",
        "/api/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
