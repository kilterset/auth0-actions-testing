import OktaCIC from "../types";
import { define } from "./define";

export const session = define<OktaCIC.Session>(() => {
  return {
    id: "sess_123fake",
    device: {
      last_asn: "AS13335",
      last_ip: "0.0.0.0",
    },
  };
});
