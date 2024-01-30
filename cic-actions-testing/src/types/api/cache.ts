export interface Cache {
  get(key: string): string | undefined;

  delete(key: string): CacheDeleteResult;

  set(
    key: string,
    value: string,
    options?: {
      expires_at?: number;
      ttl?: number;
    }
  ): CacheWriteResult;
}

type CacheSuccess = { type: "success" };

interface CacheError {
  type: "error";
  code:
    | "MaxSideEffectsExceeded"
    | "CacheKeySizeExceeded"
    | "CacheValueSizeExceeded"
    | "CacheSizeExceeded"
    | "ItemAlreadyExpired"
    | "InvalidExpiry"
    | "FailedToSetCacheRecord"
    | "FailedToDeleteCacheRecord"
    | "CacheKeyDoesNotExist";
}

type CacheWriteResult = (CacheSuccess & { record: CacheRecord }) | CacheError;

type CacheDeleteResult = CacheSuccess | CacheError;

interface CacheRecord {
  value: string;
  expires_at: number;
}
