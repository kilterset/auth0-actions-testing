import { api, events } from "..";
import Auth0 from "../../types";
import { PostChallengeOptions } from "../api";

type Handler = (
  event: Auth0.Events.PreUserRegistration,
  api: Auth0.API.PreUserRegistration
) => Promise<void>;

export function preUserRegistration({
  cache,
  now,
  ...attributes
}: Parameters<typeof events.preUserRegistration>[0] &
  Omit<PostChallengeOptions, "user" | "request"> = {}) {
  const event = events.preUserRegistration(attributes);

  const { request, user } = event;

  const { implementation, state } = api.preUserRegistration({
    user,
    request,
    now,
    cache,
  });

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
