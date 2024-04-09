import Auth0, { Factor } from "../../types";
import { cache as mockCache } from "./cache";
import { user as mockUser } from "../user";
import { request as mockRequest } from "../request";
import { ok } from "node:assert";
import { encodeHS256JWT, signHS256 } from "../../jwt/hs256";

export interface PostChallengeOptions {
  user?: Auth0.User;
  cache?: Record<string, string>;
  now?: ConstructorParameters<typeof Date>[0];
  request?: Auth0.Request;
}

interface FactorList {
  allOptions: Factor[];
  default: Factor | undefined;
}

export interface PostChallengeState {
  user: Auth0.User;
  cache: Auth0.API.Cache;
  access: { denied: false } | { denied: { reason: string } };
  authentication: {
    challenge: FactorList | false;
    enrollment: FactorList | false;
    newlyRecordedMethods: string[];
  };
  redirect: { url: URL; queryParams: Record<string, string> } | null;
}

export function postChallenge({
  user,
  request,
  cache,
  now: nowValue,
}: PostChallengeOptions = {}) {
  const apiCache = mockCache(cache);
  const userValue = user ?? mockUser();
  const requestValue = request ?? mockRequest();

  const now = new Date(nowValue || Date.now());

  const state: PostChallengeState = {
    authentication: {
      challenge: false,
      enrollment: false,
      newlyRecordedMethods: [],
    },

    user: userValue,
    access: { denied: false },
    cache: apiCache,
    redirect: null,
  };

  const api: Auth0.API.PostChallenge = {
    access: {
      deny: (reason) => {
        state.access = { denied: { reason } };
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
    },

    cache: apiCache,

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
  };

  return {
    implementation: api,
    state,
  };
}
