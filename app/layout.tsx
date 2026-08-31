import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import FloatingWhatsApp from "@/components/shared/FloatingWhatsApp";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

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
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: BUSINESS_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BUSINESS_CONFIG.name,
    description: BUSINESS_CONFIG.description,
    images: ["/images/og-default.jpg"],
  },
  alternates: {
    canonical: "./",
  },
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
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex flex-col min-h-screen bg-transparent text-slate-900 font-sans relative">
        <AnimatedBackground />

        {/* Sticky navigation header */}
        <Header />
        
        {/* Main viewport */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
        
        {/* Sticky WhatsApp Floating Button */}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
