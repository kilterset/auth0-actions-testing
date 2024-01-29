import { User } from "../user";

/**
 * TODO: Incomplete interface
 */
export interface PostLogin {
  cache: Map<string, unknown>;

  user: User & { setAppMetadata: (key: string, value: unknown) => void };

  /**
   * Modify the user's login access, such as by rejecting the login attempt.
   */
  access: {
    /**
     * Mark the current login attempt as denied. This will prevent the end-user from completing the login flow. This will NOT cancel other user-related side effects (such as metadata changes) requested by this Action. The login flow will immediately stop following the completion of this action and no further Actions will be executed.
     */
    deny(reason: string): PostLogin;
  };

  /**
   * Request changes to the access token being issued.
   */
  accessToken: {
    setCustomClaim(name: string, value: unknown): PostLogin;
  };
}
