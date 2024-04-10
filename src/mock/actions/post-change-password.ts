import { api, events } from "..";
import Auth0 from "../../types";
import { PostChallengeOptions } from "../api";

type Handler = (
  event: Auth0.Events.PostChangePassword,
  api: Auth0.API.PostChangePassword
) => Promise<void>;

export function postChangePassword({
  cache,
  ...attributes
}: Parameters<typeof events.postChangePassword>[0] &
  Omit<PostChallengeOptions, "user" | "request"> = {}) {
  const event = events.postChangePassword(attributes);

  const { implementation, state } = api.postChangePassword({ cache });

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
