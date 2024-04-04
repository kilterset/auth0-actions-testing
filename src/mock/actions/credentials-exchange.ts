import { api, events } from "..";
import Auth0 from "../../types";
import { CredentialsExchangeOptions } from "../api";

type Handler = (
  event: Auth0.Events.CredentialsExchange,
  api: Auth0.API.CredentialsExchange
) => Promise<void>;

export function credentialsExchange({
  cache,
  ...attributes
}: Parameters<typeof events.credentialsExchange>[0] &
  Omit<CredentialsExchangeOptions, "request"> = {}) {
  const event = events.credentialsExchange(attributes);

  const { implementation, state } = api.credentialsExchange({ cache });

  async function simulate(handler: Handler) {
    await handler(event, implementation);
  }

  return new Proxy(
    {
      event,
      simulate,
    },
    {
      get(target, prop) {
        if (typeof prop !== "string") {
          return;
        }

        if (prop in target) {
          return target[prop as keyof typeof target];
        }

        if (prop in state) {
          return state[prop as keyof typeof state];
        }
      },
    }
  );
}
