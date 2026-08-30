export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  description: string;
  longDescription?: string;
  categorySlug: string;
  sku: string;
  images: string[];
  imageAlt: string;
  inStock: boolean;
  stockCount: number;
  seoTitle: string;
  seoDescription: string;
  specifications?: Record<string, string>;
  dosageInstruction?: string;
  targetAnimals?: string[]; // e.g. ["Livestock", "Poultry", "Pets", "Sheep"]
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount?: number;
  iconName: string; // Used to dynamically load Lucide icons
}

export interface Review {
  id: string;
  userName: string;
  userDesignation?: string; // e.g. "Dairy Farmer", "Pet Owner", "Poultry Manager"
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
