import { define } from "../define";
import Auth0, { Connection } from "../../types";
import { user } from "../user";
import { request } from "../request";
import { transaction } from "../transaction";
import { connection } from "../connection";
import { chance } from "../chance";
import { identity } from "../identity";

export const postUserRegistration = define<Auth0.Events.PostUserRegistration>(
  ({ params }): Auth0.Events.PostUserRegistration => {
    const tenantId = params.tenant?.id || chance.auth0().tenantId();
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
      connection: connectionValue,
      tenant: { id: tenantId },
      request: requestValue,
      user: userValue,
      secrets: {},
    };
  }
);
