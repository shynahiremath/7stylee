import { create } from "zustand";
import { localStore } from "../services/local";
import type {
  BodyProfile,
  ClosetItem,
  OutfitCombo,
  SavedDesign,
  StylePersonality,
} from "../types/types";
import { bodyProfileService } from "../services/bodyProfile";
import { wishlistService } from "../services/wishlist";
import { addressService } from "../services/addresses";

export interface PrefAddress {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

interface PrefState {
  userId: string | null;
  style: StylePersonality | null;
  wishlistIds: string[];
  savedForLater: string[];
  body: BodyProfile;
  bodyLoading: boolean;
  closet: ClosetItem[];
  outfits: OutfitCombo[];
  designs: SavedDesign[];
  addresses: PrefAddress[];
  bindUser: (userId: string | null) => void;
  setStyle: (style: StylePersonality) => void;
  toggleWishlist: (productId: string) => boolean;
  inWishlist: (productId: string) => boolean;
  saveForLater: (sku: string) => void;
  removeSaved: (sku: string) => void;
  setBody: (body: BodyProfile) => Promise<void>;
  fetchBody: () => Promise<void>;
  addCloset: (item: ClosetItem) => void;
  removeCloset: (id: string) => void;
  addOutfit: (outfit: OutfitCombo) => void;
  saveDesign: (design: SavedDesign) => void;
  removeDesign: (id: string) => void;
  saveAddress: (addr: PrefAddress) => void;
  removeAddress: (id: string) => void;
}

const emptyBody: BodyProfile = {
  height: "",
  bust: "",
  waist: "",
  hip: "",
  shoulder: "",
  inseam: "",
  preferredFit: "Regular",
  preferredSize: "",
  completed: false,
};

function load(userId: string | null) {
  return {
    userId,
    style: localStore.get<StylePersonality | null>(userId, "style", null),
    wishlistIds: [] as string[],
    savedForLater: localStore.get<string[]>(userId, "later", []),
    body: emptyBody,
    bodyLoading: false,
    closet: localStore.get<ClosetItem[]>(userId, "closet", []),
    outfits: localStore.get<OutfitCombo[]>(userId, "outfits", []),
    designs: localStore.get<SavedDesign[]>(userId, "designs", []),
    addresses: [] as PrefAddress[],
  };
}

export const usePrefStore = create<PrefState>((set, get) => ({
  ...load(null),

  bindUser: (userId) => {
    set(load(userId));
    if (userId) {
      get().fetchBody();
      wishlistService.get().then((res) => set({ wishlistIds: res.data.productIds })).catch(() => {});
      addressService.get().then((res) => set({ addresses: res.data.addresses })).catch(() => {});
    }
  },

  setStyle: (style) => {
    const { userId } = get();
    localStore.set(userId, "style", style);
    set({ style });
  },

  toggleWishlist: (productId) => {
    const { wishlistIds } = get();
    const next = wishlistIds.includes(productId)
      ? wishlistIds.filter((id) => id !== productId)
      : [...wishlistIds, productId];
    set({ wishlistIds: next });
    wishlistService.update(next).catch(() => {});
    return next.includes(productId);
  },

  inWishlist: (productId) => get().wishlistIds.includes(productId),

  saveForLater: (sku) => {
    const { userId, savedForLater } = get();
    const next = [...new Set([...savedForLater, sku])];
    localStore.set(userId, "later", next);
    set({ savedForLater: next });
  },

  removeSaved: (sku) => {
    const { userId, savedForLater } = get();
    const next = savedForLater.filter((s) => s !== sku);
    localStore.set(userId, "later", next);
    set({ savedForLater: next });
  },

  fetchBody: async () => {
    if (!get().userId) return;
    set({ bodyLoading: true });
    try {
      const res = await bodyProfileService.get();
      set({ body: res.data.profile, bodyLoading: false });
    } catch {
      set({ bodyLoading: false });
    }
  },

  setBody: async (body) => {
    set({ body });
    try {
      const res = await bodyProfileService.update(body);
      set({ body: res.data.profile });
    } catch {
      /* keep optimistic value */
    }
  },

  addCloset: (item) => {
    const closet = [...get().closet, item];
    localStore.set(get().userId, "closet", closet);
    set({ closet });
  },

  removeCloset: (id) => {
    const closet = get().closet.filter((c) => c.id !== id);
    localStore.set(get().userId, "closet", closet);
    set({ closet });
  },

  addOutfit: (outfit) => {
    const outfits = [...get().outfits, outfit];
    localStore.set(get().userId, "outfits", outfits);
    set({ outfits });
  },

  saveDesign: (design) => {
    const designs = [design, ...get().designs];
    localStore.set(get().userId, "designs", designs);
    set({ designs });
  },

  removeDesign: (id) => {
    const designs = get().designs.filter((d) => d.id !== id);
    localStore.set(get().userId, "designs", designs);
    set({ designs });
  },

  saveAddress: (addr) => {
    const next = [...get().addresses.filter((a) => a.id !== addr.id), addr];
    set({ addresses: next });
    addressService.update(next).catch(() => {});
  },

  removeAddress: (id) => {
    const next = get().addresses.filter((a) => a.id !== id);
    set({ addresses: next });
    addressService.update(next).catch(() => {});
  },
}));