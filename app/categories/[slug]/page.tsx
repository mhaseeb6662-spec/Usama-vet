import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Layers, ArrowLeft } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/data/mockData";
import ProductCard from "@/components/product/ProductCard";
import { BreadcrumbsSchema } from "@/lib/seo/schema";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static routes for all veterinary categories for fast crawler scanning
export async function generateStaticParams() {
  return MOCK_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

// Dynamic SEO headers for category archives
export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested veterinary category is unavailable.",
    };
  }

  return {
    title: `${category.name} | Animal Supplies`,
    description: category.description,
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | Animal Supplies`,
      description: category.description,
      url: `${BUSINESS_CONFIG.url}/categories/${category.slug}`,
      type: "website",
      images: [
        {
          url: "/images/og-default.jpg",
          alt: category.name,
        },
      ],
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  // Filter products belonging to this category
  const filteredProducts = MOCK_PRODUCTS.filter(
    (product) => product.categorySlug === category.slug
  );

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: category.name, item: `/categories/${category.slug}` },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Breadcrumbs Structured Data Schema */}
      <BreadcrumbsSchema items={breadcrumbs} />

      {/* CATEGORY HERO HEADER */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-4">
          <nav className="flex text-xs uppercase tracking-wider font-semibold text-emerald-400 gap-2 mb-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-slate-350">Categories</span>
            <span>/</span>
            <span className="text-slate-300">{category.name}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {category.name}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-light">
            {category.description}
          </p>
        </div>
      </section>

      {/* FILTER & PRODUCTS CONTENT */}
      <section className="max-w-6xl mx-auto px-4 mt-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel: Navigation links / Filters placeholder */}
          <div className="lg:w-1/4 space-y-6 shrink-0">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">
                All Product Categories
              </h3>
              <ul className="space-y-2 text-xs">
                {MOCK_CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className={`block px-3 py-2 rounded-md font-medium transition-all ${
                        cat.slug === category.slug
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-650 hover:bg-slate-50 hover:text-emerald-600"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-slate-500 hover:text-emerald-650"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Homepage
            </Link>
          </div>

          {/* Right Panel: Products Grid */}
          <div className="lg:w-3/4 flex-grow">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-6 text-xs text-slate-500">
              <span>
                Showing <strong className="text-slate-800">{filteredProducts.length}</strong> products in {category.name}
              </span>
              <div className="flex gap-2">
                <span className="font-semibold text-slate-400">Sort By:</span>
                <span className="font-bold text-slate-700">Default (Featured)</span>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Category Empty</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  There are currently no products listed in the {category.name} category. Check back soon.
                </p>
                <Link
                  href="/"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow"
                >
                  Return Home
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
