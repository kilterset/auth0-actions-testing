import Auth0 from "../../types";
import { cache as mockCache } from "./cache";
import { request as mockRequest } from "../request";
import { accessTokenMock } from "./access-token";

export interface CredentialsExchangeOptions {
  cache?: Record<string, string>;
}

export interface CredentialsExchangeState {
  access: { denied: false } | { denied: true; code: string; reason: string };
  accessToken: {
    claims: Record<string, unknown>;
  };
  cache: Auth0.API.Cache;
}

export function credentialsExchange({
  cache,
}: CredentialsExchangeOptions = {}) {
  const apiCache = mockCache(cache);
  const accessToken = accessTokenMock("CredentialsExchange")

  const state: CredentialsExchangeState = {
    access: { denied: false },
    accessToken: accessToken.state,
    cache: apiCache,
  };

  const api: Auth0.API.CredentialsExchange = {
    access: {
      deny: (code, reason) => {
        state.access = { denied: true, code, reason };
        return api;
      },
    },

    get accessToken() {
      return accessToken.build(api);
    },

    cache: apiCache,
  };

  return {
    implementation: api,
    state,
  };
}
