import Auth0 from "../types";
import { chance } from "./chance";
import { define } from "./define";

const EXAMPLES: { name: string; strategy: string }[] = [
  { name: "Username-Password-Authentication", strategy: "auth0" },
  { name: "google-oauth2", strategy: "google-oauth2" },
  { name: "windowslive", strategy: "windowslive" },
  { name: "foo-onmicrosoft", strategy: "office365" },
  { name: "auth10.com", strategy: "adfs" },
];

export const connection = define<Auth0.Connection>(({ transientParams }) => {
  return {
    id: `con_${chance.string({ length: 24, alpha: true, numeric: true })}`,
    metadata: {},
    ...chance.pickone(EXAMPLES),
  };
});
