import { mock } from "node:test";
import OktaCIC from "../../types";
import { cache as mockCache } from "./cache";
import { user as mockUser } from "../user";

export interface PostLoginOptions {
  user?: OktaCIC.User;
  cache?: Record<string, string>;
}

interface State {
  user: OktaCIC.User;
  cache: OktaCIC.API.Cache;
  access: { denied: false } | { denied: true; reason: string };
  accessToken: {
    claims: Record<string, unknown>;
    scopes: string[];
  };
}

function notYetImplemented<T extends keyof OktaCIC.API.PostLogin>(
  namespace: T
) {
  return new Proxy({} as OktaCIC.API.PostLogin[T], {
    get(_, property) {
      throw new Error(`${namespace}.${String(property)} not yet implemented`);
    },
  });
}

export function postLogin({ user, cache }: PostLoginOptions = {}) {
  const apiCache = mockCache(cache);

  const state: State = {
    user: user ?? mockUser(),
    access: { denied: false },
    cache: apiCache,
    accessToken: {
      claims: {},
      scopes: [],
    },
  };

  const api: OktaCIC.API.PostLogin = {
    access: {
      deny: (reason) => {
        state.access = { denied: true, reason };
        return api;
      },
    },

    accessToken: {
      addScope: (name) => {
        state.accessToken.scopes = [
          ...new Set(state.accessToken.scopes).add(name),
        ];

        return api;
      },

      removeScope: (name) => {
        state.accessToken.scopes = state.accessToken.scopes.filter(
          (value) => value !== name
        );

        return api;
      },

      setCustomClaim: (name, value) => {
        state.accessToken.claims[name] = value;
        return api;
      },
    },

    authentication: notYetImplemented("authentication"),

    cache: apiCache,

    idToken: notYetImplemented("idToken"),

    multifactor: notYetImplemented("multifactor"),

    redirect: notYetImplemented("redirect"),

    samlResponse: notYetImplemented("samlResponse"),

    user: {
      setAppMetadata: (key, value) => {
        state.user.app_metadata ??= {};
        state.user.app_metadata[key] = value;
      },
    },

    validation: notYetImplemented("validation"),
  };

  return {
    implementation: api,
    state,
  };
}
