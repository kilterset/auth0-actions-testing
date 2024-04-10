import Auth0, { Factor, MultifactorEnableOptions } from "../../types";
import { cache as mockCache } from "./cache";
import { user as mockUser } from "../user";
import { request as mockRequest } from "../request";
import { ok } from "node:assert";
import { encodeHS256JWT, signHS256 } from "../../jwt/hs256";
import { accessTokenMock } from "./access-token";
import { accessMock } from "./access";
import { authenticationMock, FactorList } from "./authentication";
import { idTokenMock } from "./id-token";

export interface PostLoginOptions {
  user?: Auth0.User;
  cache?: Record<string, string>;
  executedRules?: string[];
  now?: ConstructorParameters<typeof Date>[0];
  request?: Auth0.Request;
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
  user: Auth0.User;
  cache: Auth0.API.Cache;
  access: { denied: false } | { denied: { reason: string } };
  accessToken: {
    claims: Record<string, unknown>;
    scopes: string[];
  };
  authentication: {
    primaryUserId: string;
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
  const userValue = user ?? mockUser();
  const executedRules = optionallyExecutedRules ?? [];
  const requestValue = request ?? mockRequest();

  const apiCache = mockCache(cache);
  const access = accessMock("PostLogin");
  const accessToken = accessTokenMock("PostLogin");
  const authentication = authenticationMock("PostLogin", { userId: userValue.user_id });
  const idToken = idTokenMock("PostLogin");

  const now = new Date(nowValue || Date.now());

  const state: PostLoginState = {
    user: userValue,
    access: access.state,
    accessToken: accessToken.state,
    authentication: authentication.state,
    cache: apiCache,
    idToken: idToken.state,
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
  } as Auth0.API.PostLogin["samlResponse"];

  for (const property in state.samlResponse) {
    if (state.samlResponse.hasOwnProperty(property)) {
      const key = property as keyof SamlResponseState;

      if (key === "attributes") {
        continue;
      }

      const setter = `set${key[0].toUpperCase()}${key.slice(
        1
      )}` as keyof Auth0.API.PostLogin["samlResponse"];

      samlResponse[setter] = (value: unknown) => {
        state.samlResponse[key] = value as never;
      };
    }
  }

  const api: Auth0.API.PostLogin = {
    get access() {
      return access.build(api)
    },

    get accessToken() {
      return accessToken.build(api);
    },

    get authentication() {
      return authentication.build(api);
    },

    cache: apiCache,

    get idToken() {
      return idToken.build(api);
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

        const claims = {
          iss: requestValue.hostname,
          iat: Math.floor(now.getTime() / 1000),
          exp: Math.floor((now.getTime() + expiresInSeconds * 1000) / 1000),
          sub: userValue.user_id,
          ip: requestValue.ip,
          ...payload,
        };

        return encodeHS256JWT({ secret, claims });
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

      validateToken: ({ tokenParameterName, secret }) => {
        tokenParameterName = tokenParameterName ?? "session_token";
        const params = { ...requestValue.query, ...requestValue.body };

        const tokenValue = params[tokenParameterName];

        ok(
          tokenParameterName in params,
          `There is no parameter called '${tokenParameterName}' available in either the POST body or query string.`
        );

        const [rawHeader, rawClaims, signature] = String(tokenValue).split(".");

        const verify = (condition: boolean, message: string) => {
          ok(condition, `The session token is invalid: ${message}`);
        };

        const [header, claims] = [rawHeader, rawClaims].map((part) =>
          JSON.parse(Buffer.from(part, "base64url").toString())
        );

        verify(
          claims.state === params.state,
          "State in the token does not match the /continue state."
        );

        const expectedSignature = signHS256({
          secret,
          body: `${rawHeader}.${rawClaims}`,
        });

        verify(signature === expectedSignature, "Failed signature validation");

        const expectedClaims = ["sub", "iss", "exp", "iat"];

        for (const claim of expectedClaims) {
          verify(claim in claims, "Missing or invalid standard claims");
        }

        verify(
          header.typ?.toUpperCase() === "JWT",
          "Unexpected token payload type"
        );

        verify(
          claims.sub === userValue.user_id,
          "The sub claim does not match the user_id."
        );

        verify(
          claims.exp > Math.floor(now.getTime() / 1000),
          "Token has expired."
        );

        return claims as Record<string, unknown>;
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
