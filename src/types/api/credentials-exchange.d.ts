import { Cache } from "./cache";

export interface CredentialsExchange {
  /**
   * Modify the user's login access, such as by rejecting the login attempt.
   */
  readonly access: {
    /**
     * Mark the current login attempt as denied. This will prevent the end-user from completing the login flow. This will NOT cancel other user-related side effects (such as metadata changes) requested by this Action. The login flow will immediately stop following the completion of this action and no further Actions will be executed.
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
