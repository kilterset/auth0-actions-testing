import OktaCIC from "../types";
import { chance } from "./chance";
import { define } from "./define";

export const client = define<OktaCIC.Client>(() => {
  return {
    client_id: chance.string({ length: 32, alpha: true, numeric: true }),
    name: chance.word({ syllables: 3 }),
    metadata: {},
  };
});
