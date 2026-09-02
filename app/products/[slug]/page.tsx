import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, MessageCircle, AlertTriangle } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { prisma } from "@/lib/db";
import { ProductSchema, BreadcrumbsSchema } from "@/lib/seo/schema";
import { toServedImageUrl } from "@/lib/mediaUrl";
import ProductAddToCart from "@/components/cart/ProductAddToCart";

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
  const primaryImage = toServedImageUrl(
    product.images.find((img: { isPrimary: boolean; imageUrl: string }) => img.isPrimary)?.imageUrl
    || product.images[0]?.imageUrl
    || ""
  );
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
          {/* Left Side: Image Gallery Placeholder */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="aspect-square bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden">
              {primaryImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={primaryImage} alt={product.name} className="w-full h-full object-contain p-3 sm:p-6" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-12 h-12" />
                </div>
              )}
              
              <div className="absolute top-4 left-4">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    product.stockQuantity > 0
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/65"
                      : "bg-rose-50 text-rose-700 border border-rose-200/65"
                  }`}
                >
                  {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 text-center italic">
              Image displays product type. Design template utilizes verified SVG representations.
            </span>
          </div>

          {/* Right Side: Product Details Content */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-widest block mb-1">
                Brand: {product.brand?.name || "Usama Vet"}
              </span>
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-tight break-words">
                {product.name}
              </h1>
              <span className="block mt-2 text-xs text-slate-400 font-medium">
                SKU: {product.sku} | Category: <span className="text-slate-650 font-semibold">{categoryName}</span>
              </span>
            </div>

            {/* Price display */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-450 uppercase font-bold block mb-0.5">Price</span>
                <div className="flex items-end gap-2">
                  {comparePrice && comparePrice > salePrice && (
                    <span className="text-slate-400 line-through text-sm">PKR {comparePrice.toLocaleString()}</span>
                  )}
                  <span className="text-2xl font-black text-slate-900">
                    PKR {salePrice.toLocaleString()}
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-rose-600 text-xs font-bold">{discountPercent}% OFF</span>
                  )}
                </div>
                <span className="text-xs text-slate-500 mt-1 block">Stock: {product.stockQuantity}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium max-w-[150px] text-right">
                * Prices are inclusive of all import duties.
              </span>
            </div>

            {/* Product short description */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.description || product.shortDescription}
            </p>

            {/* CTA action buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <ProductAddToCart productId={product.id} stockCount={product.stockQuantity} />
              <a
                href={`${BUSINESS_CONFIG.contact.whatsapp}?text=Hi,%20I%20want%20to%20order%20${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold px-6 py-3 rounded-lg text-center text-sm flex items-center justify-center gap-1.5 flex-grow sm:flex-grow-0"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" /> Order via WhatsApp
              </a>
            </div>

            {/* Delivery Strip */}
            <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" /> Safe Cold-Chain Shipment
              </span>
              <span className="hidden sm:inline">|</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-650 shrink-0" /> 100% Genuine Batch-Coded
              </span>
            </div>
          </div>
        </div>

        {/* Detailed specifications tab */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Specifications list (Left) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Product Overview
            </h2>
            
            <div className="text-xs text-slate-600 leading-relaxed">
              {product.description || product.shortDescription || "No detailed description available."}
            </div>
          </div>

          {/* Legal Warn (Right) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Legal Warning Notice */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-3">
              <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-600" /> Prescription Policy
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Veterinary medicines must be administered in accordance with registered veterinary recommendations. Use strictly as directed by a qualified animal health professional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
