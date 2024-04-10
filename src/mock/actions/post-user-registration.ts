import { api, events } from "..";
import Auth0 from "../../types";
import { PostChallengeOptions } from "../api";

type Handler = (
  event: Auth0.Events.PostUserRegistration,
  api: Auth0.API.PostUserRegistration
) => Promise<void>;

export function postUserRegistration({
  cache,
  ...attributes
}: Parameters<typeof events.postUserRegistration>[0] &
  Omit<PostChallengeOptions, "user" | "request"> = {}) {
  const event = events.postUserRegistration(attributes);

  const { implementation, state } = api.postUserRegistration({ cache });

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
