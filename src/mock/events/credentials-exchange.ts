import { define } from "../define";
import Auth0, { Connection } from "../../types";
import { user } from "../user";
import { request } from "../request";
import { authentication } from "../authentication";
import { transaction } from "../transaction";
import { session } from "../session";
import { connection } from "../connection";
import { organization } from "../organization";
import { client } from "../client";
import { chance } from "../chance";
import { identity } from "../identity";

export const credentialsExchange = define<Auth0.Events.CredentialsExchange>(
  ({ params }) => {
    const tenantId = params.tenant?.id || chance.auth0().tenantId();
    const hostname = params.request?.hostname || `${tenantId}.auth0.com`;

    const requestValue = request({
      hostname,
      ...params.request,
      query: {
        ...params.request?.query,
      },
    });

    const transactionValue = transaction();

    return {
      accessToken: {
        customClaims: (params?.accessToken?.customClaims || {}) as Record<
          string,
          string
        >,
        scope: transactionValue.requested_scopes,
      },
      client: client(),
      request: requestValue,
      resource_server: {
        identifier: `https://${hostname}/userinfo`,
      },
      tenant: { id: tenantId },
      transaction: { requested_scopes: transactionValue.requested_scopes },
      secrets: {},
    };
  }
);
