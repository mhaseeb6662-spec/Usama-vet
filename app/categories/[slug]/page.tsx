import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Layers, ArrowLeft } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import ProductCard from "@/components/product/ProductCard";
import { BreadcrumbsSchema } from "@/lib/seo/schema";
import { CategoryApplicationError, getCategoryListing } from "@/lib/data/categories";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  try {
    const listing = await getCategoryListing(slug);
    if (!listing) {
      return {
        title: "Category Not Found",
        description: "The requested veterinary category is unavailable.",
      };
    }

    return {
      title: `${listing.name} | Animal Supplies`,
      description: listing.description || "Browse our catalog.",
      alternates: {
        canonical: `/categories/${listing.slug}`,
      },
      openGraph: {
        title: `${listing.name} | Animal Supplies`,
        description: listing.description || "Browse our catalog.",
        url: `${BUSINESS_CONFIG.url}/categories/${listing.slug}`,
        type: "website",
      },
    };
  } catch (error) {
    console.error("[categories] metadata failed:", error);
    return {
      title: "Category",
      description: "Browse veterinary products by category.",
    };
  }
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  let products: Product[] = [];
  let listingName = "";
  let listingDescription = "";
  let listingSlug = slug;
  let error = "";
  let found = false;

  try {
    const listing = await getCategoryListing(slug);
    if (listing) {
      found = true;
      listingName = listing.name;
      listingDescription = listing.description || `Browse all active products in the ${listing.name} category.`;
      listingSlug = listing.slug;
      products = listing.products;
    }
  } catch (err) {
    if (err instanceof CategoryApplicationError) {
      error = err.message;
    } else {
      console.error("[categories] page failed:", err);
      error = "Could not load this category. Please try again.";
    }
  }

  if (!error && !found) {
    notFound();
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-10">
          <Link href="/" className="inline-flex items-center text-emerald-700 font-medium mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Link>
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-600">
            {error}
          </div>
        </div>
      </main>
    );
  }

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Categories", item: "/#categories" },
    { name: listingName, item: `/categories/${listingSlug}` },
  ];

  return (
    <>
      <BreadcrumbsSchema items={breadcrumbs} />
      <main className="min-h-screen bg-slate-50 pb-16">
        <div className="bg-emerald-800 text-white pb-8 pt-6 sm:pb-12 sm:pt-8 relative overflow-hidden">
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-700/50 rounded-full blur-3xl"></div>

          <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 2xl:px-8 relative z-10">
            <Link
              href="/"
              className="inline-flex items-center text-emerald-100 hover:text-white transition-colors mb-4 sm:mb-6 group text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Store
            </Link>

            <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 mb-4">
              <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner shrink-0">
                <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-100" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-2 drop-shadow-sm break-words">
                  {listingName}
                </h1>
                <p className="text-emerald-100 max-w-2xl text-sm sm:text-lg font-light leading-relaxed">
                  {listingDescription}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 2xl:px-8 -mt-4 sm:-mt-6 relative z-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-5 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 flex items-center">
                All Products
                <span className="ml-3 bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {products.length} items
                </span>
              </h2>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-700 mb-1">No products available</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  We currently do not have any active products in this category. Please check back later or browse other categories.
                </p>
                <Link href="/" className="mt-6 inline-block text-emerald-600 hover:text-emerald-700 font-medium">
                  Return to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
