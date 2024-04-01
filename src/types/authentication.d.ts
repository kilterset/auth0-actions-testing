import { RiskAssessment } from "./risk-assessment";

export interface Authentication {
  methods: {
    name: string;
    timestamp: string;
    type?: string;
  }[];
  riskAssessment?: RiskAssessment;
}

export type AuthenticationMethod =
  | {
      /**
       * The name of the first factor that was completed. Values include the following:
       * - `"federated"` A social or enterprise connection was used to authenticate the user as the first factor.
       * - `"pwd"` A password was used to authenticate a database connection user as the first factor.
       * - `"passkey"` A passkey was used to authenticate a database connnection user as the first factor.
       * - `"sms"` A Passwordless SMS connection was used to authenticate the user as the first factor.
       * - `"email"` A Passwordless Email connection was used to authenticate the user as the first factor or verify email for password reset.
       * - `"phone_number"` A phone number was used for password reset.
       * - "mfa" – The user completed multi-factor authentication (second or later factors).
       * - `string` A custom authentication method denoted by a URL (as second or later factor).
       */
      name: string;
      timestamp: string;
    }
  | { name: "mfa"; timestamp: string; type: string };
