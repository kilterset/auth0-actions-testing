import { Authentication } from "../authentication";
import { Client } from "../client";
import { Connection } from "../connection";
import { Request } from "../request";
import { Transaction } from "../transaction";
import { User } from "../user";

export interface PostUserRegistration {
  connection: Connection;
  request?: Request;
  tenant: {
    id: string;
  };
  transaction?: Transaction;
  user: User;
  secrets: {
    [key: string]: string;
  };
}
