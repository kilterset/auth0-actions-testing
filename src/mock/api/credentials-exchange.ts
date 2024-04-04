import Auth0, { Factor, MultifactorEnableOptions } from "../../types";
import { cache as mockCache } from "./cache";
import { user as mockUser } from "../user";
import { request as mockRequest } from "../request";
import { ok } from "node:assert";
import { encodeHS256JWT, signHS256 } from "../../jwt/hs256";

export interface CredentialsExchangeOptions {
  cache?: Record<string, string>;
  now?: ConstructorParameters<typeof Date>[0];
  request?: Auth0.Request;
}

export interface CredentialsExchangeState {
  access: { denied: false } | { denied: true; code: string; reason: string };
  accessToken: {
    claims: Record<string, unknown>;
  };
  cache: Auth0.API.Cache;
}

export function credentialsExchange({
  request,
  cache,
  now: nowValue,
}: CredentialsExchangeOptions = {}) {
  const apiCache = mockCache(cache);
  const requestValue = request ?? mockRequest();

  const now = new Date(nowValue || Date.now());

  let numCallsToSetPrimaryUser = 0;

  const state: CredentialsExchangeState = {
    access: { denied: false },
    accessToken: {
      claims: {},
    },
    cache: apiCache,
  };

  const api: Auth0.API.CredentialsExchange = {
    access: {
      deny: (code, reason) => {
        state.access = { denied: true, code, reason };
        return api;
      },
    },

    accessToken: {
      setCustomClaim: (name, value) => {
        state.accessToken.claims[name] = value;
        return api;
      },
    },

    cache: apiCache,
  };

  return {
    implementation: api,
    state,
  };
}
