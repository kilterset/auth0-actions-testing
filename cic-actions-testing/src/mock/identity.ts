import OktaCIC from "../types";
import { chance } from "./chance";
import { connection } from "./connection";
import { define } from "./define";

export const identity = define<OktaCIC.Identity>(() => {
  const attrs = connection();

  return {
    connection: attrs.name,
    provider: attrs.strategy,
    user_id: chance.hash({ length: 24 }),
    profileData: {},
    isSocial: false,
  };
});
