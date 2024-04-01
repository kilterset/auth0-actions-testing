import Auth0 from "../types";
import { chance } from "./chance";
import { define } from "./define";

export const transaction = define<Auth0.Transaction>(({ params }) => {
  const locale = params.locale || chance.locale();

  return {
    acr_values: [],
    locale,
    ui_locales: [locale],
    requested_scopes: [],
    protocol: chance.auth0().protocol(),
    redirect_uri: chance.url({ path: "redirect" }),
    prompt: ["none"],
    login_hint: chance.pickone([chance.email(), undefined]),
    response_mode: chance.pickone([
      "query",
      "fragment",
      "form_post",
      "web_message",
    ]),
    response_type: [chance.pickone(["code", "token", "id_token"])],
    state: chance.string({ length: 32, alpha: true, numeric: true }),
    requested_authorization_details: [],
    linking_id: chance.string({ length: 32, alpha: true, numeric: true }),
  };
});
