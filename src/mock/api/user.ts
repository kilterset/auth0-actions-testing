import { User } from "../../types";

export function userMock(flow: string, { user }: { user: User}) {
  const state = user

  const build = <T>(api: T) => ({
    setAppMetadata: (key: string, value: unknown) => {
      state.app_metadata ??= {};
      state.app_metadata[key] = value;
      return api;
    },
    setUserMetadata: (key: string, value: unknown) => {
      state.user_metadata ??= {};
      state.user_metadata[key] = value;
      return api;
    },
  });

  return { build, state }
}
