import { api, events } from "..";
import OktaCIC from "../../types";
import { PostLoginOptions } from "../api";

type Handler = (
  event: OktaCIC.Events.PostLogin,
  api: OktaCIC.API.PostLogin
) => Promise<void>;

export function postLogin({
  cache,
  ...attributes
}: Parameters<typeof events.postLogin>[0] &
  Omit<PostLoginOptions, "user"> = {}) {
  const event = events.postLogin(attributes);

  const { implementation, state } = api.postLogin({
    user: event.user,
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
