import OktaCIC from "../types";
import { chance } from "./chance";
import { define } from "./define";

export const client = define<OktaCIC.Client>(() => {
  return {
    client_id: chance.auth0().clientId(),
    name: chance.word({ syllables: 3 }),
    metadata: {},
  };
});
