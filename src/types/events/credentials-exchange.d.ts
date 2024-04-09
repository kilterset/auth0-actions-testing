import { Client } from "../client";
import { Request } from "../request";

export interface CredentialsExchange {
  accessToken: {
    customClaims: Record<string, string>;
    scope: string[];
  };
  client: Client;
  request: Request;
  resource_server: {
    identifier: string;
  };
  tenant: {
    id: string;
  };
  transaction: {
    requested_scopes: string[];
  };
  secrets: {
    [key: string]: string;
  };
}
