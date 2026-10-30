export type UserRole = "CUSTOMER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  isActive: boolean;
}

export interface Variant {
  color: string;
  size: string;
  sku: string;
  stock: number;
  priceModifier: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  occasionTags: string[];
  basePrice: number;
  images: string[];
  variants: Variant[];
  customizable: boolean;
  createdAt?: string;
}

export interface CartItem {
  sku: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  _id?: string;
  user?: string;
  items: CartItem[];
}

export interface ShippingAddress {
  fullName: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface OrderItem {
  product: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  _id: string;
  user: string | { _id?: string; name: string; email: string };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
}

export interface ApiError {
  message: string;
}

export const STYLE_PERSONALITIES = [
  "Minimal",
  "Elegant",
  "Bold",
  "Classic",
  "Contemporary",
  "Bohemian",
] as const;

export type StylePersonality = (typeof STYLE_PERSONALITIES)[number];

export const SHOP_CATEGORIES = [
  "New Arrivals",
  "Ready-to-Wear",
  "Custom Collection",
  "Ethnic Wear",
  "Western Wear",
  "Dresses",
  "Co-Ord Sets",
  "Office Wear",
  "Party Wear",
  "Plus Size",
  "Sale",
] as const;

export type FitPreference = "Snug" | "Regular" | "Relaxed";

export interface BodyProfile {
  height: string;
  bust: string;
  waist: string;
  hip: string;
  shoulder: string;
  inseam: string;
  preferredFit: FitPreference;
  preferredSize: string;
  completed: boolean;
}

export interface ClosetItem {
  id: string;
  name: string;
  category: "Tops" | "Bottoms" | "Dresses" | "Shoes" | "Accessories" | "Jackets";
  color: string;
  notes: string;
}

export interface OutfitCombo {
  id: string;
  topId?: string;
  bottomId?: string;
  shoesId?: string;
  accessoryId?: string;
  name: string;
}

export interface SavedDesign {
  id: string;
  garment: string;
  silhouette: string;
  fabric: string;
  color: string;
  neckline: string;
  sleeves: string;
  length: string;
  details: string;
  createdAt: string;
}

export const FREE_SHIPPING_THRESHOLD = 2000;
export const SHIPPING_FEE = 99;
