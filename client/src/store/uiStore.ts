import { create } from "zustand";

export type ToastTone = "success" | "error" | "info";

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface UiState {
  cartOpen: boolean;
  navOpen: boolean;
  toasts: Toast[];
  openCart: () => void;
  closeCart: () => void;
  toggleNav: (open?: boolean) => void;
  toast: (message: string, tone?: ToastTone) => void;
  dismiss: (id: number) => void;
}

let n = 0;

export const useUiStore = create<UiState>((set) => ({
  cartOpen: false,
  navOpen: false,
  toasts: [],
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  toggleNav: (open) => set((s) => ({ navOpen: open ?? !s.navOpen })),
  toast: (message, tone = "success") => {
    const id = ++n;
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
    window.setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3200);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
