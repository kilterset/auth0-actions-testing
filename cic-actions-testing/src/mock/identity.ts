import { define } from "./define";
import OktaCIC from "../types";

export const identity = define<OktaCIC.Identity>(() => {
  return {
    connection: "Username-Password-Authentication",
    isSocial: false,
    provider: "auth0",
    userId: "5f7c8ec7c33c6c004bbafe82",
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gU21pdGgiLCJpYXQiOjE1MTYyMzkwMjJ9.Q_w2AVguPRU2KskCXwR7ZHl09TQXEntfEA8Jj2_Jyew",
    profileData: {},
    user_id: "5f7c8ec7c33c6c004bbafe82",
  };
});
