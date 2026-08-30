import React from "react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";

/**
 * Component to inject Organization structured data.
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VeterinaryCare",
    "@id": `${BUSINESS_CONFIG.url}/#organization`,
    "name": BUSINESS_CONFIG.name,
    "url": BUSINESS_CONFIG.url,
    "logo": `${BUSINESS_CONFIG.url}/images/logo.png`, // Placeholder for future logo image
    "image": `${BUSINESS_CONFIG.url}/images/og-default.jpg`,
    "description": BUSINESS_CONFIG.description,
    "telephone": BUSINESS_CONFIG.contact.phone,
    "email": BUSINESS_CONFIG.contact.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS_CONFIG.contact.address,
      "addressLocality": "Gujranwala",
      "addressRegion": "Punjab",
      "addressCountry": "PK",
    },
    "openingHoursSpecification": BUSINESS_CONFIG.hours.map((h) => {
      // Parse days
      let daysOfWeek: string[] = [];
      if (h.days.includes("Monday - Saturday")) {
        daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      } else if (h.days.includes("Sunday")) {
        daysOfWeek = ["Sunday"];
      }
      return {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": daysOfWeek,
        "opens": h.time.includes("Closed") ? "00:00" : "09:00",
        "closes": h.time.includes("Closed") ? "00:00" : "21:00",
      };
    }),
    "sameAs": [
      BUSINESS_CONFIG.socials.facebook,
      BUSINESS_CONFIG.socials.instagram,
      BUSINESS_CONFIG.socials.twitter,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Component to inject WebSite search structured data.
 */
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BUSINESS_CONFIG.url}/#website`,
    "name": BUSINESS_CONFIG.name,
    "url": BUSINESS_CONFIG.url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BUSINESS_CONFIG.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Component to inject Breadcrumb structured data.
 */
interface BreadcrumbItem {
  name: string;
  item: string;
}

export function BreadcrumbsSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item.startsWith("http") ? item.item : `${BUSINESS_CONFIG.url}${item.item}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Component to inject Product structured data.
 * Used for product detail pages.
 */
interface ProductSchemaProps {
  name: string;
  image: string;
  description: string;
  sku: string;
  brandName: string;
  price: number;
  currency: string;
  inStock: boolean;
  productUrl: string;
  categoryName: string;
}

export function ProductSchema({
  name,
  image,
  description,
  sku,
  brandName,
  price,
  currency,
  inStock,
  productUrl,
  categoryName,
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "image": image.startsWith("http") ? image : `${BUSINESS_CONFIG.url}${image}`,
    "description": description,
    "sku": sku,
    "brand": {
      "@type": "Brand",
      "name": brandName,
    },
    "category": categoryName,
    "offers": {
      "@type": "Offer",
      "url": productUrl.startsWith("http") ? productUrl : `${BUSINESS_CONFIG.url}${productUrl}`,
      "priceCurrency": currency,
      "price": price,
      "priceValidUntil": "2030-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "VeterinaryCare",
        "name": BUSINESS_CONFIG.name,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
