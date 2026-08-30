import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, ShoppingCart, MessageCircle, AlertTriangle } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/data/mockData";
import { ProductSchema, BreadcrumbsSchema } from "@/lib/seo/schema";
import Button from "@/components/ui/Button";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static routes at build time for instant loading and 100% crawler visibility
export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

// Dynamically generate SEO metadata for each veterinary product page
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested veterinary product is unavailable.",
    };
  }

  return {
    title: product.seoTitle,
    description: product.seoDescription,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      url: `${BUSINESS_CONFIG.url}/products/${product.slug}`,
      type: "website",
      images: [
        {
          url: product.images[0] || "/images/og-default.jpg",
          alt: product.imageAlt,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const category = MOCK_CATEGORIES.find((c) => c.slug === product.categorySlug);
  const categoryName = category ? category.name : "Veterinary Products";

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: categoryName, item: `/categories/${product.categorySlug}` },
    { name: product.name, item: `/products/${product.slug}` },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Dynamic SEO JSON-LD Schemas */}
      <BreadcrumbsSchema items={breadcrumbs} />
      <ProductSchema
        name={product.name}
        image={product.images[0]}
        description={product.description}
        sku={product.sku}
        brandName={product.brand}
        price={product.price}
        currency={product.currency}
        inStock={product.inStock}
        productUrl={`/products/${product.slug}`}
        categoryName={categoryName}
      />

      {/* Main product card layout */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Left Side: Image Gallery Placeholder */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="aspect-square bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden">
              {/* Fallback graphic for medicines */}
              <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-12 h-12" />
              </div>
              
              <div className="absolute top-4 left-4">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    product.inStock
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/65"
                      : "bg-rose-50 text-rose-700 border border-rose-200/65"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
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
                Brand: {product.brand}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {product.name}
              </h1>
              <span className="block mt-2 text-xs text-slate-400 font-medium">
                SKU: {product.sku} | Category: <span className="text-slate-650 font-semibold">{categoryName}</span>
              </span>
            </div>

            {/* Price display */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-450 uppercase font-bold block mb-0.5">Price</span>
                <span className="text-2xl font-black text-slate-900">
                  {product.currency} {product.price.toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium max-w-[150px] text-right">
                * Prices are inclusive of all import duties.
              </span>
            </div>

            {/* Product short description */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Target Animals Tags */}
            {product.targetAnimals && product.targetAnimals.length > 0 && (
              <div className="space-y-1.5">
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Animal Types
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.targetAnimals.map((animal) => (
                    <span
                      key={animal}
                      className="text-[10px] font-bold bg-slate-100 border border-slate-250 text-slate-700 px-2.5 py-1 rounded"
                    >
                      {animal}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA action buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                variant="primary"
                size="md"
                disabled={!product.inStock}
                className="flex-grow sm:flex-grow-0 sm:px-8 font-bold text-sm tracking-wide gap-2 py-3"
              >
                <ShoppingCart className="w-4 h-4" /> Add To Cart
              </Button>
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
            <div className="border-t border-slate-100 pt-4 flex gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-emerald-600" /> Safe Cold-Chain Shipment
              </span>
              <span>|</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-650" /> 100% Genuine Batch-Coded
              </span>
            </div>
          </div>
        </div>

        {/* Detailed specifications tab */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Specifications list (Left) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Product Overview & Specifications
            </h2>
            
            <div className="text-xs text-slate-600 leading-relaxed">
              {product.longDescription || product.description}
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border-t border-slate-150 pt-4">
                <h3 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wider">
                  Technical Specifications
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-slate-50 pb-1.5 text-xs">
                      <dt className="text-slate-400 font-medium">{key}</dt>
                      <dd className="text-slate-800 font-semibold text-right">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* Usage, Dosage Instructions & Legal Warn (Right) */}
          <div className="lg:col-span-5 space-y-6">
            {product.dosageInstruction && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  Dosage & Administration
                </h3>
                <p className="text-xs text-slate-650 leading-relaxed">
                  {product.dosageInstruction}
                </p>
              </div>
            )}

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
