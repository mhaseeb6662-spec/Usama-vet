import React from "react";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ui/ImageUploader";
import { createProductAlert } from "@/lib/services/productAlerts";

function parseRequiredId(raw: FormDataEntryValue | null): number {
  const id = Number.parseInt(String(raw || ""), 10);
  if (Number.isNaN(id)) {
    throw new Error("Product id is required to update.");
  }
  return id;
}

async function updateProduct(formData: FormData) {
  "use server";
  const id = parseRequiredId(formData.get("id"));
  const existing = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) {
    throw new Error("Product was not found.");
  }

  const name = String(formData.get("name") || "").trim();
  const sku = String(formData.get("sku") || "").trim();
  const shortDescription = String(formData.get("shortDescription") || "");
  const description = String(formData.get("description") || "");
  const primaryImage = String(formData.get("primaryImage") || "").trim();
  const price = Number.parseFloat(String(formData.get("price") || ""));
  const salePriceRaw = String(formData.get("salePrice") || "").trim();
  const salePrice = salePriceRaw ? Number.parseFloat(salePriceRaw) : null;
  const stockQuantity = Number.parseInt(String(formData.get("stockQuantity") || ""), 10);
  const categoryIdStr = String(formData.get("categoryId") || "");
  const categoryId = categoryIdStr ? Number.parseInt(categoryIdStr, 10) : null;

  if (!name) {
    throw new Error("Product name is required.");
  }
  if (!sku) {
    throw new Error("SKU is required.");
  }
  if (Number.isNaN(price)) {
    throw new Error("Regular price is required.");
  }
  if (salePriceRaw && Number.isNaN(salePrice)) {
    throw new Error("Sale price must be a valid number.");
  }
  if (Number.isNaN(stockQuantity)) {
    throw new Error("Stock quantity is required.");
  }
  if (categoryIdStr && Number.isNaN(categoryId)) {
    throw new Error("Category is invalid.");
  }

  const skuClash = await prisma.product.findFirst({
    where: { sku, NOT: { id } },
    select: { id: true },
  });
  if (skuClash) {
    throw new Error("Another product already uses this SKU.");
  }

  let slug = existing.slug;
  if (name !== existing.name) {
    let nextSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (nextSlug.length < 3) nextSlug = `${nextSlug}-${sku}`.replace(/^-+|-+$/g, "");
    const slugClash = await prisma.product.findFirst({
      where: { slug: nextSlug, NOT: { id } },
      select: { id: true },
    });
    slug = slugClash ? `${nextSlug}-${id}` : nextSlug;
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      sku,
      shortDescription,
      description,
      price,
      salePrice,
      stockQuantity,
      categoryId,
      isFeatured: formData.get("isFeatured") === "on",
      isNewArrival: formData.get("isNewArrival") === "on",
      isBestSeller: formData.get("isBestSeller") === "on",
      isRecommended: formData.get("isRecommended") === "on",
      isTrending: formData.get("isTrending") === "on",
      seoTitle: String(formData.get("seoTitle") || ""),
      metaDescription: String(formData.get("metaDescription") || ""),
    },
  });

  const existingPrimary = existing.images.find((image) => image.isPrimary) || existing.images[0] || null;
  if (primaryImage) {
    if (existingPrimary) {
      if (existingPrimary.imageUrl !== primaryImage) {
        await prisma.productImage.update({
          where: { id: existingPrimary.id },
          data: { imageUrl: primaryImage, isPrimary: true },
        });
      }
    } else {
      await prisma.productImage.create({
        data: {
          productId: id,
          imageUrl: primaryImage,
          isPrimary: true,
          sortOrder: 0,
        },
      });
    }
  } else if (existingPrimary) {
    await prisma.productImage.delete({ where: { id: existingPrimary.id } });
  }

  await createProductAlert(id, "UPDATED", name);

  revalidatePath("/");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export default async function EditProductAdmin({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);
  if (Number.isNaN(productId)) notFound();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    }),
    prisma.category.findMany(),
  ]);

  if (!product) notFound();

  const primaryImage = product.images.find((image) => image.isPrimary) || product.images[0];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-slate-200 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-slate-600" /></Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
        <form action={updateProduct} className="space-y-8">
          <input type="hidden" name="id" value={product.id} />

          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Primary Image</label>
                <ImageUploader name="primaryImage" defaultImage={primaryImage?.imageUrl || ""} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input name="name" type="text" required defaultValue={product.name} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                <input name="sku" type="text" required defaultValue={product.sku} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select name="categoryId" defaultValue={product.categoryId ?? ""} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Pricing & Inventory</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Regular Price (Rs.)</label>
                <input name="price" type="number" step="0.01" required defaultValue={Number(product.price)} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sale Price (Rs.) (Optional)</label>
                <input name="salePrice" type="number" step="0.01" defaultValue={product.salePrice != null ? Number(product.salePrice) : ""} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                <input name="stockQuantity" type="number" required defaultValue={product.stockQuantity} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
                <input name="shortDescription" type="text" defaultValue={product.shortDescription || ""} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Description</label>
                <textarea name="description" rows={5} defaultValue={product.description || ""} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none resize-y" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Homepage Visibility Sections</h2>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isNewArrival" defaultChecked={product.isNewArrival} className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-slate-700">New Arrival</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isBestSeller" defaultChecked={product.isBestSeller} className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Best Seller</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isRecommended" defaultChecked={product.isRecommended} className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Recommended</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isTrending" defaultChecked={product.isTrending} className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Trending</span>
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">SEO (Search Engine Optimization)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SEO Title (Optional)</label>
                <input name="seoTitle" type="text" defaultValue={product.seoTitle || ""} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description (Optional)</label>
                <textarea name="metaDescription" rows={2} defaultValue={product.metaDescription || ""} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
              <Save className="w-4 h-4" /> Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
