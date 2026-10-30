import { create } from "zustand";
import type { CartItem } from "../types/types";
import { cartService } from "../services/cart";
import { errorMessage } from "../lib/utils";

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  add: (productId: string, sku: string, quantity?: number) => Promise<void>;
  remove: (sku: string) => Promise<void>;
  setQuantity: (productId: string, sku: string, quantity: number) => Promise<void>;
  count: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const res = await cartService.get();
      set({ items: res.data.cart.items || [], loading: false });
    } catch (err) {
      set({ loading: false, error: errorMessage(err, "Could not load your bag") });
    }
  },

  add: async (productId, sku, quantity = 1) => {
    const res = await cartService.add({ productId, sku, quantity });
    set({ items: res.data.cart.items || [] });
  },

  remove: async (sku) => {
    const res = await cartService.remove(sku);
    set({ items: res.data.cart.items || [] });
  },

  setQuantity: async (productId, sku, quantity) => {
    await cartService.remove(sku);
    if (quantity > 0) {
      const res = await cartService.add({ productId, sku, quantity });
      set({ items: res.data.cart.items || [] });
    } else {
      await get().fetch();
    }
  },

  count: () => get().items.reduce((n, i) => n + i.quantity, 0),
}));
