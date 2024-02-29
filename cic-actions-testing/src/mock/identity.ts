import OktaCIC from "../types";
import { chance } from "./chance";
import { define } from "./define";

export const identity = define<OktaCIC.Identity>(() => {
  return {
    connection: chance.pickone([
      "Username-Password-Authentication",
      "google-oauth2",
      "windowslive",
      "foo-onmicrosoft",
      "auth10.com",
    ]),
    provider: chance.pickone([
      "auth0",
      "google-oauth2",
      "windowslive",
      "office365",
      "adfs",
    ]),
    user_id: chance.hash({ length: 24 }),
    profileData: {},
    isSocial: false,
  };
});
