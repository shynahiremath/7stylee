import { create } from "zustand";
import type { User } from "../types/types";
import { authService } from "../services/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  hydrated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

function readUser(): User | null {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: readUser(),
  accessToken: localStorage.getItem("accessToken"),
  hydrated: false,

  setAuth: (user, accessToken) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    set({ user, accessToken });
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      /* cookie may already be gone */
    }
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    set({ user: null, accessToken: null });
  },

  hydrate: async () => {
    if (get().hydrated) return;
    try {
      const token = localStorage.getItem("accessToken");
      const cached = readUser();
      if (token) {
        const res = await authService.me();
        localStorage.setItem("user", JSON.stringify(res.data.user));
        set({ user: res.data.user, accessToken: token, hydrated: true });
        return;
      }
      if (cached) {
        const refresh = await authService.refresh();
        get().setAuth(refresh.data.user, refresh.data.accessToken);
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      set({ user: null, accessToken: null });
    } finally {
      set({ hydrated: true });
    }
  },
}));
