import api from "./api";
import type { Cart } from "../types/types";

export const cartService = {
  get: () => api.get<{ cart: Cart }>("/cart"),
  add: (payload: { productId: string; sku: string; quantity: number }) =>
    api.post<{ cart: Cart }>("/cart/add", payload),
  remove: (sku: string) => api.delete<{ cart: Cart }>(`/cart/${encodeURIComponent(sku)}`),
};
