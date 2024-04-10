export function idTokenMock(flow: string) {
  const state = {
    claims: {} as Record<string, unknown>,
  };

  const build = <T>(api: T) => ({
    setCustomClaim: (name: string, value: unknown) => {
      state.claims[name] = value;
      return api;
    },
  });

  return { state, build };
}
