import React from "react";
import { OrganizationSchema, WebSiteSchema } from "@/lib/seo/schema";
import HomeStorefront from "@/components/home/HomeStorefront";

export const dynamic = "force-dynamic";

export const metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <div className="space-y-4">
      <link rel="preload" href="/api/home" as="fetch" />
      <OrganizationSchema />
      <WebSiteSchema />
      <HomeStorefront />
    </div>
  );
}
