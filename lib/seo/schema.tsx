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
      BUSINESS_CONFIG.socials.youtube,
      BUSINESS_CONFIG.socials.tiktok,
    ].filter(Boolean),
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

export function HowToOrderSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to order from Usamavet & Surgical",
    description:
      "Place a veterinary product order on usamavetsurgical.com as a guest with Cash on Delivery, or order by WhatsApp.",
    totalTime: "PT10M",
    supply: [
      { "@type": "HowToSupply", name: "Pakistani mobile number" },
      { "@type": "HowToSupply", name: "Complete delivery address" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Open the store",
        text: "Visit https://www.usamavetsurgical.com. Login is not required.",
        url: `${BUSINESS_CONFIG.url}/how-to-order`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Find a product",
        text: "Use the search bar or Categories to open a medicine, supplement, or farm supply.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Add to cart",
        text: "Open the product page and tap Add to cart.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Review the cart",
        text: "Open Cart and tap Proceed to Checkout.",
        url: `${BUSINESS_CONFIG.url}/cart`,
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Enter shipping details",
        text: "Enter full name, Pakistani mobile number, city, and complete address. WhatsApp, email, area, landmark, and notes are optional.",
        url: `${BUSINESS_CONFIG.url}/checkout`,
      },
      {
        "@type": "HowToStep",
        position: 6,
        name: "Place the Cash on Delivery order",
        text: "Keep Cash on Delivery selected and tap Place Order. Save the order number from the success page.",
      },
      {
        "@type": "HowToStep",
        position: 7,
        name: "Confirm and track",
        text: "Our team may call or WhatsApp to confirm. Track the order with the order number and the same mobile number.",
        url: `${BUSINESS_CONFIG.url}/track-order`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
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
