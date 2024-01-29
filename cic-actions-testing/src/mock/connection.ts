import OktaCIC from "../types";
import { define } from "./define";

export const connection = define<OktaCIC.Connection>(() => {
  return {
    id: "con_fpe5kj482KO1eOzQ",
    name: "Username-Password-Authentication",
    strategy: "auth0",
    metadata: {},
  };
});
