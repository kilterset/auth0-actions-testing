import { Authentication } from "../authentication";
import { Client } from "../client";
import { Connection } from "../connection";
import { Organization } from "../organization";
import { Request } from "../request";
import { Session } from "../session";
import { Transaction } from "../transaction";
import { User } from "../user";

export interface PostChallenge {
  authentication: Authentication;
  authorization: {
    roles: string[];
  };
  client: Client;
  connection: Connection;
  request: Request;
  stats: {
    logins_count: number;
  };
  tenant: {
    id: string;
  };
  transaction: Transaction;
  user: User;
  secrets: {
    [key: string]: string;
  };
}
