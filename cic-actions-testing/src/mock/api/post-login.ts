import OktaCIC, { Factor, MultifactorEnableOptions } from "../../types";
import { createHmac } from "node:crypto";
import { cache as mockCache } from "./cache";
import { user as mockUser } from "../user";
import { request as mockRequest } from "../request";

export interface PostLoginOptions {
  user?: OktaCIC.User;
  cache?: Record<string, string>;
  executedRules?: string[];
  now?: ConstructorParameters<typeof Date>[0];
  request?: OktaCIC.Request;
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

interface FactorList {
  allOptions: Factor[];
  default: Factor | undefined;
}

export interface PostLoginState {
  user: OktaCIC.User;
  primaryUserId: string;
  cache: OktaCIC.API.Cache;
  access: { denied: false } | { denied: true; reason: string };
  accessToken: {
    claims: Record<string, unknown>;
    scopes: string[];
  };
  authentication: {
    challenge: FactorList | false;
    enrollment: FactorList | false;
    newlyRecordedMethods: string[];
  };
  idToken: {
    claims: Record<string, unknown>;
  };
  multifactor: {
    enabled:
      | false
      | {
          provider: string;
          options?: MultifactorEnableOptions;
        };
  };
  samlResponse: SamlResponseState;
  validation: {
    error: { code: string; message: string } | null;
  };
  redirect: { url: URL; queryParams: Record<string, string> } | null;
}

export function postLogin({
  user,
  request,
  cache,
  executedRules: optionallyExecutedRules,
  now: nowValue,
}: PostLoginOptions = {}) {
  const apiCache = mockCache(cache);
  const executedRules = optionallyExecutedRules ?? [];
  const userValue = user ?? mockUser();
  const requestValue = request ?? mockRequest();

  const now = new Date(nowValue || Date.now());

  let numCallsToSetPrimaryUser = 0;

  const state: PostLoginState = {
    user: userValue,
    primaryUserId: userValue.user_id,
    access: { denied: false },
    accessToken: {
      claims: {},
      scopes: [],
    },
    authentication: {
      challenge: false,
      enrollment: false,
      newlyRecordedMethods: [],
    },
    cache: apiCache,
    idToken: {
      claims: {},
    },
    multifactor: {
      enabled: false,
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
    validation: {
      error: null,
    },
    redirect: null,
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

    authentication: {
      challengeWith: (factor, options) => {
        const additionalFactors = options?.additionalFactors ?? [];

        state.authentication.challenge = {
          allOptions: [factor, ...additionalFactors],
          default: factor,
        };
      },
      challengeWithAny(factors) {
        state.authentication.challenge = {
          allOptions: factors,
          default: undefined,
        };
      },
      enrollWith(factor, options) {
        const additionalFactors = options?.additionalFactors ?? [];

        state.authentication.enrollment = {
          allOptions: [factor, ...additionalFactors],
          default: factor,
        };
      },
      enrollWithAny(factors) {
        state.authentication.enrollment = {
          allOptions: factors,
          default: undefined,
        };
      },
      setPrimaryUser: (primaryUserId) => {
        numCallsToSetPrimaryUser++;

        if (numCallsToSetPrimaryUser > 1) {
          throw new Error(
            "`authentication.setPrimaryUser` can only be set once per transaction"
          );
        }

        state.primaryUserId = primaryUserId;
      },
      recordMethod: (providerUrl) => {
        state.authentication.newlyRecordedMethods.push(providerUrl);
        return api;
      },
    },

    cache: apiCache,

    idToken: {
      setCustomClaim: (name, value) => {
        state.idToken.claims[name] = value;
        return api;
      },
    },

    multifactor: {
      enable: (provider, options) => {
        state.multifactor.enabled = { provider, options };
        return api;
      },
    },

    redirect: {
      encodeToken: ({ expiresInSeconds, payload, secret }) => {
        expiresInSeconds = expiresInSeconds ?? 900;

        const header = {
          alg: "HS256",
          typ: "JWT",
        };

        const claims = {
          iss: requestValue.hostname,
          iat: Math.floor(now.getTime() / 1000),
          exp: Math.floor((now.getTime() + expiresInSeconds * 1000) / 1000),
          sub: userValue.user_id,
          ip: requestValue.ip,
          ...payload,
        };

        const body = [header, claims]
          .map((part) =>
            Buffer.from(JSON.stringify(part)).toString("base64url")
          )
          .join(".");

        const signature = createHmac("sha256", secret)
          .update(body)
          .digest("base64url");

        return `${body}.${signature}`;
      },
      sendUserTo: (urlString, options) => {
        const url = new URL(urlString);

        if (options?.query) {
          for (const [key, value] of Object.entries(options.query)) {
            url.searchParams.append(key, value);
          }
        }

        const queryParams = Object.fromEntries(url.searchParams.entries());

        state.redirect = { url, queryParams };

        return api;
      },
      validateToken: () => {
        throw new Error("`redirect.validateToken` is not implemented");
      },
    },

    rules: {
      wasExecuted: (ruleId) => {
        return executedRules.includes(ruleId);
      },
    },

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

    validation: {
      error: (code, message) => {
        state.validation.error = { code, message };
        return api;
      },
    },
  };

  return {
    implementation: api,
    state,
  };
}
