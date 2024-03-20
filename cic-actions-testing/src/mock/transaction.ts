import OktaCIC from "../types";
import { chance } from "./chance";
import { define } from "./define";

export const transaction = define<OktaCIC.Transaction>(({ params }) => {
  const locale = params.locale || chance.locale();

  return {
    acr_values: [],
    locale,
    ui_locales: [locale],
    requested_scopes: [],
    protocol: chance.pickone([
      "oidc-basic-profile",
      "oidc-implicit-profile",
      "oauth2-device-code",
      "oauth2-resource-owner",
      "oauth2-resource-owner-jwt-bearer",
      "oauth2-password",
      "oauth2-access-token",
      "oauth2-refresh-token",
      "oauth2-token-exchange",
      "oidc-hybrid-profile",
      "samlp",
      "wsfed",
      "wstrust-usernamemixed",
    ]),
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
