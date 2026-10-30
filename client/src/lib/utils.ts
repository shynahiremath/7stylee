import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, type Product, type Variant } from "../types/types";

export function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function unitPrice(product: Pick<Product, "basePrice">, variant?: Variant | null) {
  return product.basePrice + (variant?.priceModifier || 0);
}

export function variantOf(product: Product, sku: string) {
  return product.variants.find((v) => v.sku === sku);
}

export function shippingFor(subtotal: number) {
  return subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export function inStock(product: Product) {
  return product.variants.some((v) => v.stock > 0);
}

export function colorsOf(product: Product) {
  return [...new Set(product.variants.map((v) => v.color))];
}

export function productImage(product: Product, index = 0) {
  return product.images?.[index] || product.images?.[0] || "";
}

export function errorMessage(err: unknown, fallback = "Something went wrong") {
  if (typeof err === "object" && err && "response" in err) {
    const data = (err as { response?: { data?: { message?: string } } }).response?.data;
    if (data?.message) return data.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export function matchesCategory(product: Product, category: string) {
  if (!category || category === "All") return true;
  const hay = `${product.category} ${(product.occasionTags || []).join(" ")} ${product.name}`.toLowerCase();
  const map: Record<string, string[]> = {
    "New Arrivals": [],
    "Ready-to-Wear": ["dress", "top", "wear", "coord", "co-ord", "western", "ethnic"],
    "Custom Collection": ["custom"],
    "Ethnic Wear": ["ethnic", "kurti", "saree", "festive", "anarkali"],
    "Western Wear": ["western", "blazer", "trousers", "jeans"],
    Dresses: ["dress"],
    "Co-Ord Sets": ["co-ord", "coord", "set"],
    "Office Wear": ["office", "work", "formal"],
    "Party Wear": ["party", "evening", "occasion"],
    "Plus Size": ["plus"],
    Sale: ["sale"],
  };
  if (category === "New Arrivals") return true;
  if (category === "Custom Collection") return product.customizable;
  const keys = map[category] || [category.toLowerCase()];
  return keys.some((k) => hay.includes(k)) || product.category.toLowerCase() === category.toLowerCase();
}

export function matchesStyle(product: Product, style: string | null) {
  if (!style) return true;
  const hay = `${product.name} ${product.description} ${product.category} ${(product.occasionTags || []).join(" ")}`.toLowerCase();
  const map: Record<string, string[]> = {
    Minimal: ["minimal", "clean", "linen", "simple", "ivory", "white"],
    Elegant: ["silk", "satin", "elegant", "drape", "chiffon"],
    Bold: ["bold", "print", "statement", "bright", "red"],
    Classic: ["classic", "tailor", "tweed", "navy", "black"],
    Contemporary: ["contemporary", "modern", "cut", "sculpt"],
    Bohemian: ["boho", "bohemian", "floral", "flow"],
  };
  const keys = map[style] || [style.toLowerCase()];
  return keys.some((k) => hay.includes(k));
}
