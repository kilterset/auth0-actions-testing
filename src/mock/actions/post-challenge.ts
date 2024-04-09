import { api, events } from "..";
import Auth0 from "../../types";
import { PostChallengeOptions } from "../api";

type Handler = (
  event: Auth0.Events.PostChallenge,
  api: Auth0.API.PostChallenge
) => Promise<void>;

export function postChallenge({
  cache,
  now,
  ...attributes
}: Parameters<typeof events.postLogin>[0] &
  Omit<PostChallengeOptions, "user" | "request"> = {}) {
  const event = events.postLogin(attributes);

  const { request, user } = event;

  const { implementation, state } = api.postChallenge({
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
