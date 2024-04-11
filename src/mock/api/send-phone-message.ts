import Auth0 from "../../types";
import { cache as mockCache } from "./cache";

export interface SendPhoneMessageOptions {
  cache?: Record<string, string>;
}

export interface SendPhoneMessageState {
  cache: Auth0.API.Cache;
}

export function sendPhoneMessage({ cache }: SendPhoneMessageOptions = {}) {
  const apiCache = mockCache(cache);

  const state: SendPhoneMessageState = {
    cache: apiCache,
  };

  const api: Auth0.API.SendPhoneMessage = {
    cache: apiCache,
  };

  return {
    implementation: api,
    state,
  };
}
