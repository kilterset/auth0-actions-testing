import { define } from "./define";
import OktaCIC from "../types";
import { identity } from "./identity";

export const user = define<OktaCIC.User>(() => {
  return {
    app_metadata: {},
    created_at: "2024-01-25T20:30:33.768Z",
    email_verified: true,
    email: "j+smith@example.com",
    family_name: "Smith",
    given_name: "John",
    identities: [identity()],
    last_password_reset: "2024-01-25T20:30:33.768Z",
    name: "j+smith@example.com",
    nickname: "j+smith",
    phone_number: "18882352699",
    phone_verified: false,
    picture: "http://www.gravatar.com/avatar/?d=identicon",
    updated_at: "2024-01-25T20:30:33.768Z",
    user_id: "auth0|5f7c8ec7c33c6c004bbafe82",
    user_metadata: {},
    username: "jsmith",
    multifactor: [],
    enrolledFactors: [],
  };
});
