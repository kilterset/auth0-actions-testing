const SCOPES = [
  "openid",
  "profile",
  "email",
  "offline_access",
  "phone",
] as const;

const RESPONSE_TYPES = [
  "code",
  "token",
  "id_token",
  "none",
  "code id_token",
  "token id_token",
  "code token",
  "code id_token token",
] as const;

declare global {
  namespace Chance {
    interface Chance {
      oAuth(): {
        scopes: (
          options?: { length: number } | { min?: number; max: number }
        ) => (typeof SCOPES)[number][];

        responseType: () => (typeof RESPONSE_TYPES)[number][];
      };
    }
  }
}

export const oAuth = (chance: Chance.Chance) => {
  return {
    scopes: (options?: { length: number } | { min?: number; max: number }) => {
      const opts = options || { max: SCOPES.length };

      const n =
        "length" in opts
          ? opts.length
          : chance.integer({ min: opts.min || 1, max: opts.max });

      return chance.pickset([...SCOPES], n);
    },

    responseType: () => {
      return chance.pickone([...RESPONSE_TYPES]);
    },
  };
};
