import Auth0 from "../../types";
import { cache as mockCache } from "./cache";

export interface PostChangePasswordOptions {
  cache?: Record<string, string>;
}

export interface PostChangePasswordState {
  cache: Auth0.API.Cache;
}

export function postChangePassword({ cache }: PostChangePasswordOptions = {}) {
  const apiCache = mockCache(cache);

  const state: PostChangePasswordState = {
    cache: apiCache,
  };

  const api: Auth0.API.PostChangePassword = {
    cache: apiCache,
  };

  return {
    implementation: api,
    state,
  };
}
