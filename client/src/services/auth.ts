import api from "./api";
import type { User } from "../types/types";

export const authService = {
  register: (payload: { name: string; email: string; password: string }) =>
    api.post<{ user: User; accessToken: string }>("/auth/register", payload),

  login: (payload: { email: string; password: string }) =>
    api.post<{ user: User; accessToken: string }>("/auth/login", payload),

  me: () => api.get<{ user: User }>("/auth/me"),

  refresh: () => api.post<{ user: User; accessToken: string }>("/auth/refresh"),

  logout: () => api.post<{ message: string }>("/auth/logout"),
};
