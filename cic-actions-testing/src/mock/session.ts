import OktaCIC from "../types";
import { chance } from "./chance";
import { define } from "./define";

export const session = define<OktaCIC.Session>(() => {
  return {
    id: `sess_${chance.hash({ length: 10 })}`,
    device: {
      // AS numbers, or ASNs, are unique 16 bit numbers between 1 and 65534 or
      // 32 bit numbers between 131072 and 4294967294. They are presented in
      // this format: AS(number).
      last_asn: `AS${Math.floor(Math.random() * 65534)}`,
      last_ip: chance.ip(),
    },
  };
});
