import type { Metadata, Viewport } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import FloatingWhatsApp from "@/components/shared/FloatingWhatsApp";
import AppProviders from "@/components/providers/AppProviders";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS_CONFIG.url),
  title: {
    default: `${BUSINESS_CONFIG.name} | ${BUSINESS_CONFIG.tagline}`,
    template: `%s | ${BUSINESS_CONFIG.shortName}`,
  },
  description: BUSINESS_CONFIG.description,
  verification: {
    google: "bYVdPGtemuAUdGU0wMLXcJEikaK6XrgXmBxEXFv4Ebw",
  },
  keywords: [
    "veterinary medicine Pakistan",
    "livestock supplements Gujranwala",
    "animal health care store",
    "cattle milk booster",
    "pet tick spray Pakistan",
    "poultry vitamins online",
    "Usama Vet Care",
  ],
  authors: [{ name: BUSINESS_CONFIG.name }],
  icons: {
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon-48x48.png",
    apple: "/icons/icon-192x192.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BUSINESS_CONFIG.url,
    siteName: BUSINESS_CONFIG.name,
    title: BUSINESS_CONFIG.name,
    description: BUSINESS_CONFIG.description,
    images: [
      {
        url: BUSINESS_CONFIG.logo.image,
        width: 512,
        height: 512,
        alt: BUSINESS_CONFIG.logo.imageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BUSINESS_CONFIG.name,
    description: BUSINESS_CONFIG.description,
    images: [BUSINESS_CONFIG.logo.image],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html:
              "html,body{background:#f8fafc;color:#0f172a;margin:0}body{min-height:100vh}",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="uv-static-retry";function retry(){if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,"1");var u=new URL(location.href);u.searchParams.set("_uv",String(Date.now()));location.replace(u.toString())}window.addEventListener("error",function(e){var t=e.target;if(!t)return;var url=t.src||t.href||"";if(url.indexOf("/_next/static/")!==-1)retry()},true)}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-x-hidden">
        <AnimatedBackground />
        <AppProviders>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <FloatingWhatsApp />
        </AppProviders>
      </body>
    </html>
  );
}
