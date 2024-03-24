import OktaCIC from "../types";
import { chance } from "./chance";
import { define } from "./define";

export const session = define<OktaCIC.Session>(() => {
  return {
    id: `sess_${chance.hash({ length: 10 })}`,
    device: {
      last_asn: chance.asn(),
      last_ip: chance.ip(),
    },
  };
});
