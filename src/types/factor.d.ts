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

export type Factor = SimpleFactor | PhoneFactor;

export interface MultifactorEnableOptions {
  allowRememberBrowser?: boolean;
  providerOptions?: Record<string, unknown>;
}
