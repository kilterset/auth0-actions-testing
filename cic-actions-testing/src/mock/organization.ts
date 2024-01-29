import OktaCIC from "../types";
import { define } from "./define";

export const organization = define<OktaCIC.Organization>(() => {
  return {
    display_name: "My Organization",
    id: "org_juG7cAQ0CymOcVpV",
    metadata: {},
    name: "my-organization",
  };
});
