import { api, events } from "..";
import Auth0 from "../../types";
import { PostChallengeOptions } from "../api";

type Handler = (
  event: Auth0.Events.SendPhoneMessage,
  api: Auth0.API.SendPhoneMessage
) => Promise<void>;

export function sendPhoneMessage({
  cache,
  ...attributes
}: Parameters<typeof events.sendPhoneMessage>[0] &
  Omit<PostChallengeOptions, "user" | "request"> = {}) {
  const event = events.sendPhoneMessage(attributes);

  const { implementation, state } = api.sendPhoneMessage({ cache });

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
