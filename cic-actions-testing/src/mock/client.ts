import OktaCIC from "../types";
import { define } from "./define";

export const client = define<OktaCIC.Client>(() => {
  return {
    client_id: "gmOWNgklfRm4tyl5YYnl3JDSJy19h1bR",
    name: "All Applications",
    metadata: {},
  };
});
