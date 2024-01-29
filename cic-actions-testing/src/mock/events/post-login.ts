import { define } from "../define";
import OktaCIC from "../../types";
import { user } from "../user";
import { request } from "../request";
import { authentication } from "../authentication";
import { transaction } from "../transaction";
import { session } from "../session";
import { connection } from "../connection";
import { organization } from "../organization";
import { client } from "../client";

export const postLogin = define<OktaCIC.Events.PostLogin>(() => {
  return {
    transaction: transaction(),
    authentication: authentication(),
    authorization: {
      roles: [],
    },
    connection: connection(),
    organization: organization(),
    resource_server: {
      identifier: "dev-dieu8ws4.auth0.com/api/v2",
    },
    tenant: {
      id: "dev-dieu8ws4",
    },
    session: session(),
    client: client(),
    request: request(),
    stats: {
      logins_count: 62,
    },
    user: user(),
    secrets: {},
  };
});
