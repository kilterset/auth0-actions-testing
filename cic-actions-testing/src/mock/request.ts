import OktaCIC from "../types";
import { chance } from "./chance";
import { connection } from "./connection";
import { define } from "./define";

export const request = define<OktaCIC.Request>(() => {
  const { name: connectionName } = connection();

  return {
    ip: chance.ip(),
    asn: chance.pickone([chance.asn(), undefined]),
    method: chance.pickone(["GET", "POST"]),
    query: {
      protocol: chance.auth0().protocol(),
      connection: connectionName,
      client_id: chance.auth0().clientId(),
      response_type: chance.oAuth().responseType(),
      prompt: chance.pickone(["login", undefined]),
      scope: chance.oAuth().scopes().join(" "),
      redirect_uri: chance.url({ path: "redirect" }),
    },
    body: {},
    geoip: {
      cityName: chance.city(),
      continentCode: chance.string({ length: 2, alpha: true }),
      countryCode3: chance.string({ length: 3, alpha: true }),
      countryCode: chance.country(),
      countryName: chance.country({ full: true }),
      latitude: chance.latitude(),
      longitude: chance.longitude(),
      subdivisionCode: chance.state(),
      subdivisionName: chance.state({ full: true }),
      timeZone: chance.tzIdentifier(),
    },
    hostname: chance.auth0().domain(),
    language: chance.locale(),
    user_agent: chance.useragent(),
  };
});
