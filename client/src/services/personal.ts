/**
 * Personalization services.
 * Only auth, products, cart, and orders have backend endpoints.
 * These helpers isolate local persistence so they can be swapped for APIs later.
 */
import { localStore } from "./local";
import type { BodyProfile, ClosetItem, SavedDesign, StylePersonality } from "../types/types";

export const personalService = {
  /** No GET/PUT /api/users/style — client storage only */
  style: {
    get: (userId: string | null) => localStore.get<StylePersonality | null>(userId, "style", null),
    set: (userId: string | null, style: StylePersonality) => localStore.set(userId, "style", style),
  },
  /** No wishlist routes */
  wishlist: {
    get: (userId: string | null) => localStore.get<string[]>(userId, "wishlist", []),
    set: (userId: string | null, ids: string[]) => localStore.set(userId, "wishlist", ids),
  },
  /** No body-profile routes */
  body: {
    get: (userId: string | null, fallback: BodyProfile) => localStore.get(userId, "body", fallback),
    set: (userId: string | null, body: BodyProfile) => localStore.set(userId, "body", body),
  },
  /** No closet routes */
  closet: {
    get: (userId: string | null) => localStore.get<ClosetItem[]>(userId, "closet", []),
    set: (userId: string | null, items: ClosetItem[]) => localStore.set(userId, "closet", items),
  },
  /** No custom-design routes */
  designs: {
    get: (userId: string | null) => localStore.get<SavedDesign[]>(userId, "designs", []),
    set: (userId: string | null, designs: SavedDesign[]) => localStore.set(userId, "designs", designs),
  },
  /**
   * No AI stylist endpoint. Callers should use productService.list()
   * and filter — never invent model replies.
   */
  stylist: {
    available: false as const,
  },
};
