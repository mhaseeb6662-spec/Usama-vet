export type StoredCartItem = {
  productId: number;
  quantity: number;
};

export const CART_STORAGE_KEY = "usama-vet-cart";

const listeners = new Set<() => void>();

export function subscribeCart(listener: () => void): () => void {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

export function getCartSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  return window.localStorage.getItem(CART_STORAGE_KEY) || "[]";
}

export function getServerCartSnapshot(): string {
  return "[]";
}

export function parseCart(raw: string): StoredCartItem[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => Number.isInteger(item?.productId) && Number.isInteger(item?.quantity) && item.quantity > 0)
      .map((item) => ({ productId: item.productId, quantity: item.quantity }));
  } catch {
    return [];
  }
}

export function writeCart(items: StoredCartItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  listeners.forEach((listener) => listener());
}
