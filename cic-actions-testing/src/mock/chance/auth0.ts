declare global {
  namespace Chance {
    interface Chance {
      auth0(): {
        tenantId: () => string;
        domain: () => string;
        clientId: () => string;
        protocol: () => (typeof PROTOCOLS)[number];
      };
    }
  }
}

const PROTOCOLS = [
  "oidc-basic-profile",
  "oidc-implicit-profile",
  "oauth2-device-code",
  "oauth2-resource-owner",
  "oauth2-resource-owner-jwt-bearer",
  "oauth2-password",
  "oauth2-access-token",
  "oauth2-refresh-token",
  "oauth2-token-exchange",
  "oidc-hybrid-profile",
  "samlp",
  "wsfed",
  "wstrust-usernamemixed",
] as const;

export const auth0 = (chance: Chance.Chance) => {
  return {
    tenantId: () => chance.n(chance.word, 2).join("-"),
    domain: () => chance.auth0().tenantId() + ".auth0.com",
    clientId: () => chance.string({ length: 32, alpha: true, numeric: true }),
    protocol: () => chance.pickone([...PROTOCOLS]),
  };
};
