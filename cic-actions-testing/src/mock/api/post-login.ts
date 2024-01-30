import OktaCIC from "../../types";
import { cache as mockCache } from "./cache";
import { user as mockUser } from "../user";

export interface PostLoginOptions {
  user?: OktaCIC.User;
  cache?: Record<string, string>;
}

export function postLogin({
  user,
  cache,
}: PostLoginOptions = {}): OktaCIC.API.PostLogin {
  const userForApi = user ?? mockUser();

  const api: OktaCIC.API.PostLogin = {
    access: {
      deny: (reason: string) => api,
    },

    accessToken: {
      setCustomClaim: (name: string, value: unknown) => api,
    },

    cache: mockCache(cache),

    user: {
      ...userForApi,

      setAppMetadata: (key, value) => {
        userForApi.app_metadata ??= {};
        userForApi.app_metadata[key] = value;
      },
    },
  };

  return api;
}
