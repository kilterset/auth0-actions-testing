import { api, events } from "..";
import OktaCIC from "../../types";
import { PostLoginOptions } from "../api";

type Handler = (
  event: OktaCIC.Events.PostLogin,
  api: OktaCIC.API.PostLogin
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

  return {
    event,
    simulate,
    ...state,
  };
}
