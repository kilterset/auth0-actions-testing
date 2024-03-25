import Chance from "chance";
import { asn } from "./asn";
import { auth0 } from "./auth0";
import { oAuth } from "./oauth";
import { useragent } from "./useragent";

const chance = new Chance();

const mixins: Record<string, (instance: typeof chance) => unknown> = {
  asn,
  auth0,
  oAuth,
  useragent,
};

for (const [name, mixin] of Object.entries(mixins)) {
  chance.mixin({ [name]: () => mixin(chance) });
}

export { chance };
