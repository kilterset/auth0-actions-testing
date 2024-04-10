import Auth0 from "../../types";
import { cache as mockCache } from "./cache";
import { user as mockUser } from "../user";

export interface PreUserRegistrationOptions {
  user?: Auth0.User;
  cache?: Record<string, string>;
  now?: ConstructorParameters<typeof Date>[0];
  request?: Auth0.Request;
}

export interface PreUserRegistrationState {
  user: Auth0.User;
  cache: Auth0.API.Cache;
  access: { denied: false } | { denied: { code: string; reason: string } };
  validation: {
    error: { code: string; message: string } | null;
  };
}

export function preUserRegistration({
  user,
  cache,
}: PreUserRegistrationOptions = {}) {
  const apiCache = mockCache(cache);
  const userValue = user ?? mockUser();

  const state: PreUserRegistrationState = {
    user: userValue,
    access: { denied: false },
    cache: apiCache,
    validation: {
      error: null,
    },
  };

  const api: Auth0.API.PreUserRegistration = {
    access: {
      deny: (code, reason) => {
        state.access = { denied: { code, reason } };
        return api;
      },
    },

    cache: apiCache,

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
