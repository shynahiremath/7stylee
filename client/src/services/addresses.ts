import api from "./api";
import type { PrefAddress } from "../store/preferenceStore";

export const addressService = {
  get: () => api.get<{ addresses: PrefAddress[] }>("/addresses"),
  update: (addresses: PrefAddress[]) => api.put<{ addresses: PrefAddress[] }>("/addresses", { addresses }),
};