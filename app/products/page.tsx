import React from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { prisma } from "@/lib/db";
import { mapProductToUI } from "@/lib/data/adapters";
import type { Product } from "@/types";

export const metadata = {
  title: "All Products | Usama Vet",
  description: "Browse all veterinary medicines, supplements, and farm supplies.",
};

export const dynamic = "force-dynamic";

export default async function AllProductsPage() {
  let products: Product[] = [];
  try {
    const rawProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 2 },
        category: true,
        brand: true,
      },
      orderBy: { createdAt: "desc" },
    });
    
    products = rawProducts.map((p) => {
      try {
        return mapProductToUI(p);
      } catch (e) {
        return null;
      }
    }).filter(Boolean) as Product[];
  } catch (error) {
    console.error("[products] page failed:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 pt-5 sm:pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2">All Products</h1>
            <p className="text-slate-500 text-sm sm:text-base">
              Browse our complete catalog of veterinary supplies.
            </p>
          </div>
          <p className="text-emerald-700 font-semibold text-sm mt-2 sm:mt-0 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            {products.length} Products Found
          </p>
        </div>

        {products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-slate-700 font-medium mb-2">No products available at the moment.</p>
            <Link href="/" className="text-emerald-700 font-semibold hover:underline">Return Home</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
