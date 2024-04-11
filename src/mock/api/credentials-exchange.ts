import Auth0 from "../../types";
import { cache as mockCache } from "./cache";
import { accessTokenMock } from "./access-token";
import { accessMock } from "./access";

export interface CredentialsExchangeOptions {
  cache?: Record<string, string>;
}

export interface CredentialsExchangeState {
  access: { denied: false } | { denied: { code: string; reason: string } };
  accessToken: {
    claims: Record<string, unknown>;
  };
  cache: Auth0.API.Cache;
}

export function credentialsExchange({
  cache,
}: CredentialsExchangeOptions = {}) {
  const apiCache = mockCache(cache);
  const access = accessMock("CredentialsExchange");
  const accessToken = accessTokenMock("CredentialsExchange");

  const state: CredentialsExchangeState = {
    access: access.state,
    accessToken: accessToken.state,
    cache: apiCache,
  };

  const api: Auth0.API.CredentialsExchange = {
    get access() {
      return access.build(api);
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
