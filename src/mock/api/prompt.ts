import { MultifactorEnableOptions } from "../../types";

interface PromptState {
  promptId: string;
  promptOptions?: { [key: string]: unknown };
}

export function promptMock(flow: string) {
  const state: { rendered: PromptState | null } = {
    rendered: null,
  };

  const build = <T>(api: T) => ({
    render: (promptId: string, promptOptions?: { [key: string]: unknown }) => {
      state.rendered = { promptId, promptOptions };
    },
  });

  return { state, build };
}
