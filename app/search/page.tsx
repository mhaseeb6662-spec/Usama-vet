import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { SearchApplicationError, searchProducts } from "@/lib/services/productSearch";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search Products",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const rawQuery = params.q?.trim() || "";

  let products: Product[] = [];
  let error = "";
  if (!rawQuery) {
    error = "Enter a product name, SKU, or category to search.";
  } else {
    try {
      products = await searchProducts(rawQuery);
    } catch (err) {
      if (err instanceof SearchApplicationError) {
        error = err.message;
      } else {
        console.error("[search] page failed:", err);
        error = "Could not search products. Please try again.";
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Search Products</h1>
        <p className="text-slate-500 mb-6">
          {rawQuery ? `Results for “${rawQuery}”` : "Find veterinary medicines, supplements, and farm supplies."}
        </p>

        <form action="/search" className="mb-8 flex gap-2 max-w-xl">
          <input
            name="q"
            defaultValue={rawQuery}
            placeholder="Enter medicine name, SKU or category..."
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button type="submit" className="bg-[#009473] hover:bg-[#028467] text-white font-semibold px-5 rounded-lg">
            Search
          </button>
        </form>

        {error ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-600">{error}</div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-slate-700 font-medium mb-2">No products matched “{rawQuery}”.</p>
            <Link href="/" className="text-emerald-700 font-semibold">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
