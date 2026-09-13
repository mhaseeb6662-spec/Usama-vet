import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, MessageCircle, AlertTriangle } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { prisma } from "@/lib/db";
import { ProductSchema, BreadcrumbsSchema } from "@/lib/seo/schema";
import { toServedImageUrl } from "@/lib/mediaUrl";
import ProductAddToCart from "@/components/cart/ProductAddToCart";
import ProductImageGallery from "@/components/product/ProductImageGallery";

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  let product: any = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: { images: true }
    });
  } catch (error) {
    console.error("Failed to load product for metadata:", error);
  }

  if (!product || !product.isActive) {
    return {
      title: "Product Not Found",
      description: "The requested veterinary product is unavailable.",
    };
  }

  const primaryImage = toServedImageUrl(
    product.images.find((img: any) => img.isPrimary)?.imageUrl
      || product.images[0]?.imageUrl
      || "/images/og-default.jpg"
  );

  return {
    title: product.seoTitle || product.name,
    description: product.metaDescription || product.shortDescription,
    robots: product.indexable === false ? { index: false, follow: true } : { index: true, follow: true },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.metaDescription || product.shortDescription,
      url: `${BUSINESS_CONFIG.url}/products/${product.slug}`,
      type: "website",
      images: [
        {
          url: primaryImage,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  let product: any = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        category: true,
        brand: true
      }
    });
  } catch (error) {
    console.error("Failed to load product:", error);
  }

  if (!product || !product.isActive) {
    notFound();
  }

  const category = product.category;
  const categoryName = category ? category.name : "Veterinary Products";
  const galleryImages = product.images
    .map((img: { imageUrl: string }) => toServedImageUrl(img.imageUrl))
    .filter((url: string) => url.length > 0);
  const primaryImage = galleryImages[0] || "";
  const salePrice = Number(product.salePrice || product.price);
  const comparePrice = product.salePrice ? Number(product.price) : null;
  const discountPercent = comparePrice && comparePrice > salePrice
    ? Math.round(((comparePrice - salePrice) / comparePrice) * 100)
    : 0;

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: categoryName, item: `/categories/${category?.slug || ""}` },
    { name: product.name, item: `/products/${product.slug}` },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 sm:pb-16">
      {/* Dynamic SEO JSON-LD Schemas */}
      <BreadcrumbsSchema items={breadcrumbs} />
      <ProductSchema
        name={product.name}
        image={product.images[0]?.imageUrl || ""}
        description={product.description || product.shortDescription || ""}
        sku={product.sku || ""}
        brandName={product.brand?.name || "Usama Vet"}
        price={Number(product.salePrice || product.price)}
        currency="PKR"
        inStock={product.stockQuantity > 0}
        productUrl={`/products/${product.slug}`}
        categoryName={categoryName}
      />

      {/* Main product card layout */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 pt-5 sm:pt-8">
        {/* Breadcrumbs Navigation UI */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-emerald-600 hover:underline">Home</Link>
          <span>/</span>
          {category && (
            <>
              <Link href={`/categories/${category.slug}`} className="hover:text-emerald-600 hover:underline">
                {category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-700 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
          {/* Left Side: Product image gallery */}
          <div className="md:col-span-5">
            <ProductImageGallery
              images={galleryImages}
              productName={product.name}
              inStock={product.stockQuantity > 0}
              videoUrl={product.videoUrl}
            />
          </div>

          {/* Right Side: Product Details Content */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-7 lg:pl-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                {product.brand?.name || "Usama Vet"}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight break-words">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 font-medium">
                <span>SKU: <span className="text-slate-800">{product.sku}</span></span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>Category: <Link href={`/categories/${category?.slug || ""}`} className="text-emerald-650 hover:underline">{categoryName}</Link></span>
              </div>
            </div>

            {/* Price display */}
            <div className="bg-gradient-to-br from-emerald-50/80 to-slate-50 border border-emerald-100/60 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Price</span>
                <div className="flex items-center gap-3">
                  {comparePrice && comparePrice > salePrice && (
                    <span className="text-slate-400 line-through text-lg">PKR {comparePrice.toLocaleString()}</span>
                  )}
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    PKR {salePrice.toLocaleString()}
                  </span>
                  {discountPercent > 0 && (
                    <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${product.stockQuantity > 0 ? "bg-emerald-500" : "bg-rose-500"}`}></div>
                  <span className="text-sm font-medium text-slate-600">
                    {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
                  </span>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium max-w-[150px] sm:text-right">
                * Prices are inclusive of all import duties and taxes.
              </span>
            </div>

            {/* Product short description */}
            {product.shortDescription && (
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed border-l-4 border-slate-200 pl-4 py-1">
                {product.shortDescription}
              </p>
            )}

            {/* CTA action buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4 border-t border-slate-100">
              <ProductAddToCart productId={product.id} stockCount={product.stockQuantity} />
              <a
                href={`${BUSINESS_CONFIG.contact.whatsapp}?text=Hi,%20I%20want%20to%20order%20${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#075E54] font-bold px-8 py-3 rounded-xl text-center text-sm sm:text-base flex items-center justify-center gap-2 flex-grow sm:flex-grow-0 transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" /> Order via WhatsApp
              </a>
            </div>

            {/* Delivery Strip */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-slate-600 font-medium">
              <span className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600 shrink-0" /> Safe Cold-Chain Shipment
              </span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" /> 100% Genuine Batch-Coded
              </span>
            </div>
          </div>
        </div>

        {/* Detailed specifications tab */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 sm:mt-12">
          {/* Specifications list (Left) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4">
              Product Overview
            </h2>
            
            <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line prose prose-slate max-w-none">
              {product.description || product.shortDescription || "No detailed description available."}
            </div>
          </div>

          {/* Legal Warn (Right) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Legal Warning Notice */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="font-bold text-amber-900 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" /> Prescription Policy
              </h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                Veterinary medicines must be administered in accordance with registered veterinary recommendations. Use strictly as directed by a qualified animal health professional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
