import { prisma } from "@/lib/db";
import { toServedImageUrl } from "@/lib/mediaUrl";
import { SHIPPING_FEE } from "@/lib/constants/checkout";

export type QuotedCartItem = {
  productId: number;
  slug: string;
  name: string;
  sku: string;
  image: string;
  quantity: number;
  unitPrice: number;
  compareAtPrice: number | null;
  lineTotal: number;
  stock: number;
  isActive: boolean;
  error: string | null;
};

export type CartQuote = {
  items: QuotedCartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  canCheckout: boolean;
};

function unitPrice(product: { price: unknown; salePrice: unknown | null }): number {
  return Number(product.salePrice ?? product.price ?? 0);
}

export async function quoteCartItems(
  requested: { productId: number; quantity: number }[]
): Promise<CartQuote> {
  const uniqueIds = [...new Set(requested.map((item) => item.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: uniqueIds } },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  const productsById = new Map(products.map((product) => [product.id, product]));

  const items: QuotedCartItem[] = requested.map((item) => {
    const product = productsById.get(item.productId);
    if (!product) {
      return {
        productId: item.productId,
        slug: "",
        name: "Unavailable product",
        sku: "",
        image: "",
        quantity: item.quantity,
        unitPrice: 0,
        compareAtPrice: null,
        lineTotal: 0,
        stock: 0,
        isActive: false,
        error: "This product is no longer available.",
      };
    }

    const stock = product.stockQuantity;
    const active = product.isActive;
    const price = unitPrice(product);
    const compareAt = product.salePrice ? Number(product.price) : null;
    let error: string | null = null;
    if (!active) error = "This product is no longer available.";
    else if (stock <= 0) error = "This product is out of stock.";
    else if (item.quantity > stock) error = `Only ${stock} items are available.`;

    const safeQty = Math.min(item.quantity, Math.max(stock, 0));

    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      image: toServedImageUrl(product.images.find((img) => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl || ""),
      quantity: item.quantity,
      unitPrice: price,
      compareAtPrice: compareAt && compareAt > price ? compareAt : null,
      lineTotal: error ? 0 : price * safeQty,
      stock,
      isActive: active,
      error,
    };
  });

  const validItems = items.filter((item) => !item.error);
  const subtotal = validItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingFee = validItems.length > 0 ? SHIPPING_FEE : 0;
  const discount = 0;

  return {
    items,
    subtotal,
    shippingFee,
    discount,
    total: subtotal + shippingFee - discount,
    canCheckout: items.length > 0 && items.every((item) => !item.error),
  };
}
