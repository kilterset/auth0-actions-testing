import { User } from "../user";
import { Cache } from "./cache";

interface SimpleFactor {
  /** A type of authentication factor such as `push-notification`, `phone`, `email`, `otp`, `webauthn-roaming` and `webauthn-platform`. */
  type:
    | "otp"
    | "recovery-code"
    | "email"
    | "webauthn-platform"
    | "webauthn-roaming"
    | "push-notification"
    | string;

  /** Additional options for configuring a factor of a given type. */
  options?: {
    [property: string]: any;
  };
}

type PhoneFactor = {
  type: "phone";
  options?: { preferredMethod?: "voice" | "sms" | "both" };
};

type Factor = SimpleFactor | PhoneFactor;

export interface MultifactorEnableOptions {
  allowRememberBrowser?: boolean;
  providerOptions?: Record<string, unknown>;
}

export interface PostChallenge {
  /**
   * Modify the user's login access, such as by rejecting the login attempt.
   */
  readonly access: {
    /**
     * Mark the current login attempt as denied. This will prevent the end-user from completing the login flow. This will NOT cancel other user-related side effects (such as metadata changes) requested by this Action. The login flow will immediately stop following the completion of this action and no further Actions will be executed.
     */
    deny(reason: string): PostChallenge;
  };

  /**
   * Request changes to the authentication state of the current user's session.
   */
  readonly authentication: {
    challengeWith(
      factor: Factor,
      options?: { additionalFactors?: Factor[] }
    ): void;
    challengeWithAny(factors: Factor[]): void;
  };

  readonly cache: Cache;

  readonly redirect: {
    encodeToken(options: {
      expiresInSeconds?: number;
      payload: {
        [key: string]: unknown;
      };
      secret: string;
    }): string;

    sendUserTo(
      url: string,
      options?: {
        query?: {
          [param: string]: string;
        };
      }
    ): PostChallenge;

    validateToken(options: {
      secret: string;
      tokenParameterName?: string;
    }): any;
  };
}
