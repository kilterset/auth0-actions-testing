import { User } from "../user";
import { Cache } from "./cache";

interface Factor {
  /** A type of authentication factor such as `push-notification`, `phone`, `email`, `otp`, `webauthn-roaming` and `webauthn-platform`. */
  type: string;
  /** Additional options for configuring a factor of a given type. */
  options?: {
    [property: string]: any;
  };
  [additionalProperties: string]: any;
}

/**
 * TODO: Incomplete interface
 */
export interface PostLogin {
  /**
   * Modify the user's login access, such as by rejecting the login attempt.
   */
  readonly access: {
    /**
     * Mark the current login attempt as denied. This will prevent the end-user from completing the login flow. This will NOT cancel other user-related side effects (such as metadata changes) requested by this Action. The login flow will immediately stop following the completion of this action and no further Actions will be executed.
     */
    deny(reason: string): PostLogin;
  };

  /**
   * Request changes to the access token being issued.
   */
  readonly accessToken: {
    addScope(scope: string): PostLogin;
    removeScope(scope: string): PostLogin;
    setCustomClaim(name: string, value: unknown): PostLogin;
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
    recordMethod(provider_url: string): PostLogin;
    setPrimaryUser(primary_user_id: string): void;
  };

  readonly cache: Cache;

  readonly idToken: {
    setCustomClaim(key: string, value: unknown): PostLogin;
  };

  readonly multifactor: {
    enable(
      provider: string,
      options?: {
        allowRememberBrowser?: boolean;
        providerOptions?: Record<string, unknown>;
      }
    ): PostLogin;
  };

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
    ): PostLogin;

    canRedirect(): boolean;

    validateToken(options: {
      secret: string;
      tokenParameterName?: string;
    }): any;
  };

  readonly user: {
    setAppMetadata: (key: string, value: string) => PostLogin;
    setUserMetadata: (key: string, value: string) => PostLogin;
  };

  readonly samlResponse: {
    setAttribute(
      attribute: string,
      value: string | number | boolean | null | (string | number | boolean)[]
    ): void;
    setAudience(audience: string): void;
    setRecipient(recipient: string): void;
    setCreateUpnClaim(createUpnClaim: boolean): void;
    setPassthroughClaimsWithNoMapping(
      passthroughClaimsWithNoMapping: boolean
    ): void;
    setMapUnknownClaimsAsIs(mapUnknownClaimsAsIs: boolean): void;
    setMapIdentities(mapIdentities: boolean): void;
    setSignatureAlgorithm(signatureAlgorithm: "rsa-sha256"): void;
    setSignatureAlgorithm(signatureAlgorithm: "rsa-sha1"): void;
    setDigestAlgorithm(digestAlgorithm: "sha256"): void;
    setDigestAlgorithm(digestAlgorithm: "sha1"): void;
    setDestination(destination: string): void;
    setLifetimeInSeconds(lifetimeInSeconds: number): void;
    setSignResponse(signResponse: boolean): void;
    setNameIdentifierFormat(nameIdentifierFormat: string): void;
    setNameIdentifierProbes(nameIdentifierProbes: string[]): void;
    setAuthnContextClassRef(authnContextClassRef: string): void;
    setSigningCert(signingCert: string): void;
    setIncludeAttributeNameFormat(includeAttributeNameFormat: boolean): void;
    setTypedAttributes(typedAttributes: boolean): void;
    setEncryptionCert(encryptionCert: string): void;
    setEncryptionPublicKey(encryptionPublicKey: string): void;
    setCert(cert: string): void;
    setKey(key: string): void;
  };

  readonly validation: {
    error(errorCode: string, errorMessage: string): PostLogin;
  };
}
