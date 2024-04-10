import { define } from "../define";
import Auth0, { Connection } from "../../types";
import { user } from "../user";
import { request } from "../request";
import { transaction } from "../transaction";
import { session } from "../session";
import { connection } from "../connection";
import { organization } from "../organization";
import { client } from "../client";
import { chance } from "../chance";
import { identity } from "../identity";

export const preUserRegistration = define<Auth0.Events.PreUserRegistration>(
  ({ params }) => {
    const tenantId = params.tenant?.id || chance.n(chance.word, 2).join("-");
    const hostname = params.request?.hostname || `${tenantId}.auth0.com`;

    const connectionValue = params.connection
      ? (params.connection as Connection)
      : connection();

    const identities = params.user?.identities || [];

    identities.splice(
      0,
      1,
      identity({
        connection: connectionValue.name,
        provider: connectionValue.strategy,
        ...(identities[0] || {}),
      })
    );

    const userValue = user({ ...params.user, identities });

    const requestValue = request({
      hostname,
      ...params.request,
      query: {
        connection: connectionValue.name,
        ...params.request?.query,
      },
    });

    const transactionValue = transaction();

    return {
      transaction: transactionValue,
      authorization: {
        roles: [],
      },
      connection: connectionValue,
      organization: organization(),
      resource_server: {
        identifier: `https://${hostname}/userinfo`,
      },
      tenant: { id: tenantId },
      session: session({}, { ip: requestValue.ip, asn: requestValue.asn }),
      client: client(),
      request: requestValue,
      stats: {
        logins_count: chance.integer({ min: 0, max: 1_000 }),
      },
      user: userValue,
      secrets: {},
    };
  }
);
