import { MultifactorEnableOptions } from "../../types";

export function multifactorMock(flow: string) {
  const state = {
    enabled: false as false | { provider: string; options?: MultifactorEnableOptions },
  };

  const build = <T>(api: T) => ({
    enable: (provider: string, options?: MultifactorEnableOptions) => {
      state.enabled = { provider, options };
      return api;
    },
  });

  return { state, build };
}
