import OktaCIC from "../../types";

// “If no lifetime is specified, a default of lifetime of 15 minutes will be used.”
const FIFTEEN_MINS_IN_MS = 15 * 60 * 1000;

export function cache(values: Record<string, string> = {}): OktaCIC.API.Cache {
  const cacheMap = new Map<string, { value: string; expires_at: number }>();

  const cache: OktaCIC.API.Cache = {
    get: (key) => {
      const record = cacheMap.get(key);

      if (record && record.expires_at > Date.now()) {
        return record.value;
      }
    },

    set: (key, value, options) => {
      const ttl = options?.ttl ?? FIFTEEN_MINS_IN_MS;
      const expires_at = options?.expires_at ?? Date.now() + ttl;

      const record = { value, expires_at };
      cacheMap.set(key, record);

      return { type: "success", record };
    },

    delete: (key) => {
      if (cacheMap.delete(key)) {
        return { type: "success" };
      } else {
        return {
          type: "error",
          code: "CacheKeyDoesNotExist",
        };
      }
    },
  };

  Object.entries(values).forEach(([key, value]) => cache.set(key, value));

  return cache;
}
