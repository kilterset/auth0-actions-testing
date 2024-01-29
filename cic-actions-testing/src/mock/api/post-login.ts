import OktaCIC from "../../types";
import { user as mockUser } from "../user";

export function postLogin({
  user,
  cache,
}: {
  user?: OktaCIC.User;
  cache?: Map<string, unknown>;
} = {}): OktaCIC.API.PostLogin {
  const userForApi = user ?? mockUser();
  const cacheForApi = cache ?? new Map<string, unknown>();

  const api: OktaCIC.API.PostLogin = {
    access: {
      deny: (reason: string) => api,
    },

    accessToken: {
      setCustomClaim: (name: string, value: unknown) => api,
    },

    cache: cacheForApi,

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
