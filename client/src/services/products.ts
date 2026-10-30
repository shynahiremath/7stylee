import api from "./api";
import type { Product } from "../types/types";

export const productService = {
  list: () => api.get<{ products: Product[] }>("/products"),
  get: (id: string) => api.get<{ product: Product }>(`/products/${id}`),
  create: (payload: Partial<Product> & { name: string; description: string; category: string; basePrice: number }) =>
    api.post<{ product: Product }>("/products", payload),
  update: (id: string, payload: Partial<Product>) =>
    api.put<{ product: Product }>(`/products/${id}`, payload),
  remove: (id: string) => api.delete<{ message: string }>(`/products/${id}`),
};