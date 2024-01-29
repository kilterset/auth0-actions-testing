import OktaCIC from "../types";
import { define } from "./define";

export const transaction = define<OktaCIC.Transaction>(() => {
  return {
    acr_values: [],
    locale: "en",
    requested_scopes: [],
    ui_locales: ["en"],
    protocol: "oidc-basic-profile",
    redirect_uri: "http://someuri.com",
    prompt: ["none"],
    login_hint: "test@test.com",
    response_mode: "form_post",
    response_type: ["id_token"],
    state: "AABBccddEEFFGGTTasrs",
    requested_authorization_details: [
      {
        type: "foo",
      },
    ],
    linking_id: "abc_dynamic_linking_id_123",
  };
});
