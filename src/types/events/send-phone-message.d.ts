import { Authentication } from "../authentication";
import { Client } from "../client";
import { Connection } from "../connection";
import { Request } from "../request";
import { Transaction } from "../transaction";
import { User } from "../user";

export interface SendPhoneMessage {
  client?: Client;

  message_options: {
    /**
     * The flow that triggered this action.
     */
    action: "enrollment" | "second-factor-authentication" | string;
    /**
     * One-time password that the user needs to use to enter in the form.
     */
    code: string;

    /**
     * How the message will be delivered.
     */
    message_type: "sms" | "voice" | string;

    /**
     * Phone number where the message will be sent.
     */
    recipient: string;

    /**
     * Content of the message to be sent.
     */
    text: string;
  };

  request: Request;
  tenant: {
    id: string;
  };
  user: User;
  secrets: {
    [key: string]: string;
  };
}
