interface AccessTokenMock {
  build: <T>(api: T) => {
    addScope: (name: string) => T;
    removeScope: (name: string) => T;
    setCustomClaim: (name: string, value: unknown) => T;
  };
  state: {
    scopes: string[];
    claims: Record<string, unknown>;
  };
}

interface CredentialsExchangeAccessTokenMock {
  build: <T>(api: T) => {
    setCustomClaim: (name: string, value: unknown) => T;
  };
  state: {
    claims: Record<string, unknown>;
  };
}

export function accessTokenMock(flow: "CredentialsExchange"): CredentialsExchangeAccessTokenMock;
export function accessTokenMock(flow: string): AccessTokenMock;
export function accessTokenMock(flow: string) {
  switch(flow) {
    case "CredentialsExchange": {
      const state = {
        claims: {} as Record<string, unknown>,
      };
  
      const build = <T>(api: T) => ({
        setCustomClaim: (name: string, value: unknown) => {
          state.claims[name] = value;
          return api;
        },
      })
  
      return { build, state };
    }

    default: {
      const state = {
        scopes: [] as string[],
        claims: {} as Record<string, unknown>,
      };

      const build = <T>(api: T) => ({
        addScope: (name: string) => {
          state.scopes = [
            ...new Set(state.scopes).add(name),
          ];

          return api;
        },

        removeScope: (name: string) => {
          state.scopes = state.scopes.filter(
            (value) => value !== name
          );

          return api;
        },

        setCustomClaim: (name: string, value: unknown) => {
          state.claims[name] = value;
          return api;
        },
      })

      return { build, state };
    }
  }
}
