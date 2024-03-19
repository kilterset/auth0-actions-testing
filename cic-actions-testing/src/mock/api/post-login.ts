import { mock } from "node:test";
import OktaCIC from "../../types";
import { cache as mockCache } from "./cache";
import { user as mockUser } from "../user";

export interface PostLoginOptions {
  user?: OktaCIC.User;
  cache?: Record<string, string>;
}

type SamlAttributeValue =
  | string
  | number
  | boolean
  | null
  | Array<string | number | boolean>;

interface SamlResponseState {
  attributes: Record<string, SamlAttributeValue>;
  createUpnClaim: boolean;
  passthroughClaimsWithNoMapping: boolean;
  mapUnknownClaimsAsIs: boolean;
  mapIdentities: boolean;
  signResponse: boolean;
  lifetimeInSeconds: number;
  nameIdentifierFormat: string;
  nameIdentifierProbes: string[];
  authnContextClassRef: string;
  includeAttributeNameFormat: boolean;
  typedAttributes: boolean;
  audience: string;
  recipient: string;
  destination: string;
  cert?: string;
  encryptionCert?: string;
  encryptionPublicKey?: string;
  key?: string;
  signingCert?: string;
}

export interface PostLoginState {
  user: OktaCIC.User;
  cache: OktaCIC.API.Cache;
  access: { denied: false } | { denied: true; reason: string };
  accessToken: {
    claims: Record<string, unknown>;
    scopes: string[];
  };
  idToken: {
    claims: Record<string, unknown>;
  };
  samlResponse: SamlResponseState;
}

function notYetImplemented<T extends keyof OktaCIC.API.PostLogin>(
  namespace: T
) {
  return new Proxy({} as OktaCIC.API.PostLogin[T], {
    get(_, property) {
      throw new Error(`${namespace}.${String(property)} not yet implemented`);
    },
  });
}

export function postLogin({ user, cache }: PostLoginOptions = {}) {
  const apiCache = mockCache(cache);

  const state: PostLoginState = {
    user: user ?? mockUser(),
    access: { denied: false },
    cache: apiCache,
    accessToken: {
      claims: {},
      scopes: [],
    },
    idToken: {
      claims: {},
    },
    samlResponse: {
      // Custom attributes
      attributes: {},

      // Default literal values
      createUpnClaim: true,
      passthroughClaimsWithNoMapping: true,
      mapUnknownClaimsAsIs: false,
      mapIdentities: true,
      signResponse: false,
      includeAttributeNameFormat: true,
      typedAttributes: true,
      lifetimeInSeconds: 3600,

      nameIdentifierFormat:
        "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",

      nameIdentifierProbes: [
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
      ],

      authnContextClassRef:
        "urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified",

      // Default dynamic values
      audience: "default-audience",
      recipient: "default-recipient",
      destination: "default-destination",
    },
  };

  const samlResponse = {
    setAttribute: (attribute: string, value: SamlAttributeValue) => {
      state.samlResponse.attributes[attribute] = value;
    },
  } as OktaCIC.API.PostLogin["samlResponse"];

  for (const property in state.samlResponse) {
    if (state.samlResponse.hasOwnProperty(property)) {
      const key = property as keyof SamlResponseState;

      if (key === "attributes") {
        continue;
      }

      const setter = `set${key[0].toUpperCase()}${key.slice(
        1
      )}` as keyof OktaCIC.API.PostLogin["samlResponse"];

      samlResponse[setter] = (value: unknown) => {
        state.samlResponse[key] = value as never;
      };
    }
  }

  const api: OktaCIC.API.PostLogin = {
    access: {
      deny: (reason) => {
        state.access = { denied: true, reason };
        return api;
      },
    },

    accessToken: {
      addScope: (name) => {
        state.accessToken.scopes = [
          ...new Set(state.accessToken.scopes).add(name),
        ];

        return api;
      },

      removeScope: (name) => {
        state.accessToken.scopes = state.accessToken.scopes.filter(
          (value) => value !== name
        );

        return api;
      },

      setCustomClaim: (name, value) => {
        state.accessToken.claims[name] = value;
        return api;
      },
    },

    authentication: notYetImplemented("authentication"),

    cache: apiCache,

    idToken: {
      setCustomClaim: (name, value) => {
        state.idToken.claims[name] = value;
        return api;
      },
    },

    multifactor: notYetImplemented("multifactor"),

    redirect: notYetImplemented("redirect"),

    samlResponse,

    user: {
      setAppMetadata: (key, value) => {
        state.user.app_metadata ??= {};
        state.user.app_metadata[key] = value;
        return api;
      },
      setUserMetadata: (key, value) => {
        state.user.user_metadata ??= {};
        state.user.user_metadata[key] = value;
        return api;
      },
    },

    validation: notYetImplemented("validation"),
  };

  return {
    implementation: api,
    state,
  };
}
