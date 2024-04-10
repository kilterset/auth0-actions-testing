interface AccessMock {
  build: <API>(api: API) => {
    deny: (reason: string) => API;
  };
  state: {
    denied: false | { reason: string };
  };
};

interface CredentialsExchangeAccessMock {
  build: <API>(api: API) => {
    deny: (code: string, reason: string) => API;
  };
  state: {
    denied: false | { code: string; reason: string };
  };
};

export function accessMock(flow: "CredentialsExchange"): CredentialsExchangeAccessMock;
export function accessMock(flow: string): AccessMock;
export function accessMock(flow: string) {
  switch(flow) {
    case "CredentialsExchange": {
      const state = {
        denied: false as false | { code: string; reason: string },
      };

      const build = <API>(api: API) => ({
        deny: (code: string, reason: string) => {
          state.denied = { code, reason };
          return api;
        },
      });

      return { build, state };
    }

    default: {
      const state = {
        denied: false as false | { reason: string },
      };

      const build = <API>(api: API) => ({
        deny: (reason: string) => {
          state.denied = { reason };
          return api;
        },
      });

      return { build, state };
    }
  }
}
