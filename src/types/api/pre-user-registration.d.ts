import { User } from "../user";
import { Cache } from "./cache";

export interface PreUserRegistration {
  /**
   * Modify the access of the user that is logging in, such as rejecting the registration attempt.
   */
  readonly access: {
    /**
     * Deny the user from being able to register. The signup flow will immediately stop following the completion of this action and no further Actions will be executed.
     */
    deny(code: string, reason: string): PreUserRegistration;
  };

  /**
   * Store and retrieve data that persists across executions.
   */
  readonly cache: Cache;

  readonly user: {
    setAppMetadata: (key: string, value: string) => PreUserRegistration;
    setUserMetadata: (key: string, value: string) => PreUserRegistration;
  };

  readonly validation: {
    error(errorCode: string, errorMessage: string): PreUserRegistration;
  };
}
