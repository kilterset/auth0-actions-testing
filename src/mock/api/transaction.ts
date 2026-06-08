type TransactionMetadata = Record<string, string | number | boolean>;

export function transactionMock(
  flow: string,
  { metadata = {} }: { metadata?: TransactionMetadata } = {}
) {
  const state = { metadata };

  const build = <API>(api: API) => ({
    setMetadata: (key: string, value: string | number | boolean | null) => {
      if (value === null) {
        delete state.metadata[key];
      } else {
        state.metadata[key] = value;
      }

      return api;
    },
  });

  return { build, state };
}
