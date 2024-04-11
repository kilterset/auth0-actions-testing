import { error } from "console";

export function validationMock(flow: string) {
  const state = {
    error: null as null | { code: string; message: string },
  };

  const build = <T>(api: T) => ({
    error: (code: string, message: string) => {
      state.error = { code, message };
      return api;
    },
  });

  return { state, build };
}
