/**
 * Client-only persistence for experiences the backend does not yet expose.
 * Replace these with API calls when endpoints exist.
 */

const key = (userId: string | null, name: string) => `7style:${userId || "guest"}:${name}`;

export const localStore = {
  get<T>(userId: string | null, name: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key(userId, name));
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(userId: string | null, name: string, value: T) {
    localStorage.setItem(key(userId, name), JSON.stringify(value));
  },
};
