import { Cache } from "./cache";

export interface CredentialsExchange {
  /**
   * Modify the access, such as by rejecting the exchange attempt.
   */
  readonly access: {
    /**
     * Mark the current exchange attempt as denied. This will prevent the initiating party from completing the exchange flow.
     */
    deny(code: string, reason: string): CredentialsExchange;
  };

  /**
   * Request changes to the access token being issued.
   */
  readonly accessToken: {
    setCustomClaim(name: string, value: unknown): CredentialsExchange;
  };

  readonly cache: Cache;
}
