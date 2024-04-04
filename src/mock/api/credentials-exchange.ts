import Auth0 from "../../types";
import { cache as mockCache } from "./cache";
import { request as mockRequest } from "../request";

export interface CredentialsExchangeOptions {
  cache?: Record<string, string>;
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
}: CredentialsExchangeOptions = {}) {
  const apiCache = mockCache(cache);
  const requestValue = request ?? mockRequest();

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
