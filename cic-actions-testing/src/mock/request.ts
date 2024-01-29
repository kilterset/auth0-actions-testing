import OktaCIC from "../types";
import { define } from "./define";

export const request = define<OktaCIC.Request>(() => {
  return {
    ip: "13.33.86.47",
    asn: "AS13335",
    method: "GET",
    query: {
      protocol: "oauth2",
      client_id: "gmOWNgklfRm4tyl5YYnl3JDSJy19h1bR",
      response_type: "code",
      connection: "Username-Password-Authentication",
      prompt: "login",
      scope: "openid profile",
      redirect_uri:
        "https://example/tester/callback?connection=Username-Password-Authentication",
    },
    body: {},
    geoip: {
      cityName: "Bellevue",
      continentCode: "NA",
      countryCode3: "USA",
      countryCode: "US",
      countryName: "United States of America",
      latitude: 47.61793,
      longitude: -122.19584,
      subdivisionCode: "WA",
      subdivisionName: "Washington",
      timeZone: "America/Los_Angeles",
    },
    hostname: "dev-dieu8ws4.auth0.com",
    language: "en",
    user_agent: "curl/7.64.1",
  };
});
