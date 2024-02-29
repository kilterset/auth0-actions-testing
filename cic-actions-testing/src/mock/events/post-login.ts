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
import { chance } from "../chance";

export const postLogin = define<OktaCIC.Events.PostLogin>(({ params }) => {
  const tenantId = params.tenant?.id || chance.n(chance.word, 2).join("-");

  return {
    transaction: transaction(),
    authentication: authentication(),
    authorization: {
      roles: [],
    },
    connection: connection(),
    organization: organization(),
    resource_server: {
      identifier: `${tenantId}.auth0.com/api/v2`,
    },
    tenant: { id: tenantId },
    session: session(),
    client: client(),
    request: request(),
    stats: {
      logins_count: chance.integer({ min: 0, max: 1_000 }),
    },
    user: user(),
    secrets: {},
  };
});
