import { api, events } from "..";
import OktaCIC from "../../types";
import { user as mockUser } from "../user";

type Handler = (
  event: OktaCIC.Events.PostLogin,
  api: OktaCIC.API.PostLogin
) => void;

export function postLogin(...params: Parameters<typeof events.postLogin>) {
  const event = events.postLogin(...params);
  const postLoginApi = api.postLogin({ user: event.user });

  async function simulate(handler: Handler) {
    return handler(event, postLoginApi);
  }

  return {
    ...event,
    simulate,
  };
}
