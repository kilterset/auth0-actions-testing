import { api, events } from "..";
import Auth0 from "../../types";
import { PostLoginOptions } from "../api";

type Handler = (
  event: Auth0.Events.PostLogin,
  api: Auth0.API.PostLogin
) => Promise<void>;

export function postLogin({
  cache,
  now,
  executedRules,
  ...attributes
}: Parameters<typeof events.postLogin>[0] &
  Omit<PostLoginOptions, "user" | "request"> = {}) {
  const event = events.postLogin(attributes);

  const { request, user } = event;

  const { implementation, state } = api.postLogin({
    user,
    request,
    now,
    executedRules,
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
