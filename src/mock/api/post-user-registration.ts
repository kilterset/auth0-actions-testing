import Auth0 from "../../types";
import { cache as mockCache } from "./cache";

export interface PostUserRegistrationOptions {
  cache?: Record<string, string>;
}

export interface PostUserRegistrationState {
  cache: Auth0.API.Cache;
}

export function postUserRegistration({
  cache,
}: PostUserRegistrationOptions = {}) {
  const apiCache = mockCache(cache);

  const state: PostUserRegistrationState = {
    cache: apiCache,
  };

  const api: Auth0.API.PostUserRegistration = {
    cache: apiCache,
  };

  return {
    implementation: api,
    state,
  };
}
