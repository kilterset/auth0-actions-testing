import { define } from "../define";
import Auth0 from "../../types";
import { user } from "../user";
import { request } from "../request";
import { chance } from "../chance";
import { client } from "../client";
import { phoneMessageOptions } from "../phone-message-options";

export const sendPhoneMessage = define<Auth0.Events.SendPhoneMessage>(
  ({ params }): Auth0.Events.SendPhoneMessage => {
    const tenantId = params.tenant?.id || chance.auth0().tenantId();
    const hostname = params.request?.hostname || `${tenantId}.auth0.com`;

    const requestValue = request({
      hostname,
      ...params.request,
      query: {
        ...params.request?.query,
      },
    });

    return {
      client: client(),
      message_options: phoneMessageOptions(),
      request: requestValue,
      tenant: { id: tenantId },
      user: user(),
      secrets: {},
    };
  }
);
