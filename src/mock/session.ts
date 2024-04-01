import Auth0 from "../types";
import { chance } from "./chance";
import { define } from "./define";

interface SessionTransientParams {
  deviceIdPrefix: "last" | "initial";
  ip: string;
  asn: string;
}

export const session = define<Auth0.Session, SessionTransientParams>(
  ({ params, transientParams }) => {
    const prefix =
      transientParams.deviceIdPrefix || chance.pickone(["last", "initial"]);

    const ip = transientParams.ip || chance.ipv6();
    const asn = transientParams.asn || chance.asn();

    const device = params.device || {
      [`${prefix}_asn`]: asn,
      [`${prefix}_ip`]: ip,
    };

    return {
      id: `sess_${chance.hash({ length: 10 })}`,
      device,
    };
  }
);
