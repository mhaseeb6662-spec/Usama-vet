import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Layers, ArrowLeft } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/product/ProductCard";
import { BreadcrumbsSchema } from "@/lib/seo/schema";
import { mapProductToUI } from "@/lib/data/adapters";

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  let category = null;
  try {
    category = await prisma.category.findUnique({
      where: { slug }
    });
  } catch (error) {
    console.error("Failed to load category for metadata:", error);
  }

  if (!category || !category.isActive) {
    return {
      title: "Category Not Found",
      description: "The requested veterinary category is unavailable.",
    };
  }

  return {
    title: `${category.name} | Animal Supplies`,
    description: category.description || "Browse our catalog.",
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | Animal Supplies`,
      description: category.description || "Browse our catalog.",
      url: `${BUSINESS_CONFIG.url}/categories/${category.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  let category = null;
  try {
    category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          include: { images: true, category: true, brand: true }
        }
      }
    });
  } catch (error) {
    console.error("Failed to load category:", error);
  }

  if (!category || !category.isActive) {
    notFound();
  }

  const mappedProducts = category.products.map(mapProductToUI);

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Categories", item: "/#categories" },
    { name: category.name, item: `/categories/${category.slug}` }
  ];

  return (
    <>
      <BreadcrumbsSchema items={breadcrumbs} />
      <main className="min-h-screen bg-slate-50 pb-16">
        <div className="bg-emerald-800 text-white pb-12 pt-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-700/50 rounded-full blur-3xl"></div>
          
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 2xl:px-8 relative z-10">
            <Link 
              href="/" 
              className="inline-flex items-center text-emerald-100 hover:text-white transition-colors mb-6 group text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Store
            </Link>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner">
                <Layers className="w-7 h-7 text-emerald-100" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 drop-shadow-sm">
                  {category.name}
                </h1>
                <p className="text-emerald-100 max-w-2xl text-lg font-light leading-relaxed">
                  {category.description || `Browse all active products in the ${category.name} category.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-6 2xl:px-8 -mt-6 relative z-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                All Products
                <span className="ml-3 bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {mappedProducts.length} items
                </span>
              </h2>
            </div>
            
            {mappedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {mappedProducts.map((product) => (
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
