import api from "./api";

export const wishlistService = {
  get: () => api.get<{ productIds: string[] }>("/wishlist"),
  update: (productIds: string[]) => api.put<{ productIds: string[] }>("/wishlist", { productIds }),
};