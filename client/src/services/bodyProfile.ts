import api from "./api";
import type { BodyProfile } from "../types/types";

export const bodyProfileService = {
  get: () => api.get<{ profile: BodyProfile & { _id: string } }>("/body-profile"),
  update: (payload: Partial<BodyProfile>) =>
    api.put<{ profile: BodyProfile & { _id: string } }>("/body-profile", payload),
};