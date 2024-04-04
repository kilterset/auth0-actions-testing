import { Authentication } from "../authentication";
import { Client } from "../client";
import { Connection } from "../connection";
import { Organization } from "../organization";
import { Request } from "../request";
import { Session } from "../session";
import { Transaction } from "../transaction";
import { User } from "../user";

export interface PostLogin {
  transaction: Transaction;
  authentication: Authentication;
  authorization: {
    roles: string[];
  };
  connection: Connection;
  organization: Organization;
  resource_server: {
    identifier: string;
  };
  tenant: {
    id: string;
  };
  session: Session;
  client: Client;
  request: Request;
  stats: {
    logins_count: number;
  };
  user: User;
  secrets: {
    [key: string]: string;
  };
}
