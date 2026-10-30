import api from "./api";
import type { User } from "../types/types";

export const userService = {
  all: () => api.get<{ users: User[] }>("/users"),
  updateRole: (id: string, role: string) =>
    api.patch<{ user: User }>(`/users/${id}/role`, { role }),
  updateStatus: (id: string, isActive: boolean) =>
    api.patch<{ user: User }>(`/users/${id}/status`, { isActive }),
};