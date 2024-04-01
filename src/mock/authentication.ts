import { fail, ok } from "assert";
import Auth0 from "../types";
import { chance } from "./chance";
import { define } from "./define";
import { riskAssessment } from "./risk-assessment";

interface AuthenticationTransientParmas {
  numMethods?: number;
}

export const authentication = define<
  Auth0.Authentication,
  AuthenticationTransientParmas
>(({ params, transientParams }) => {
  let methods = params.methods;

  if (!Array.isArray(methods)) {
    const numMethods =
      typeof transientParams.numMethods === "number"
        ? transientParams.numMethods
        : chance.integer({ min: 1, max: 2 });

    methods = Array.from({ length: numMethods }, () => authenticationMethod());
  } else if (typeof transientParams.numMethods === "number") {
    fail("Please specify only one of `methods` and `numMethods`");
  }

  return {
    methods,
    riskAssessment: riskAssessment(),
  };
});

export const authenticationMethod = define<Auth0.AuthenticationMethod>(
  ({ params }) => {
    const name =
      params.name ||
      chance.pickone([
        "federated",
        "pwd",
        "passkey",
        "sms",
        "email",
        "phone_number",
        "mfa",
      ]);

    const extra =
      name === "mfa"
        ? {
            type: chance.pickone([
              "email",
              "otp",
              "push-notification",
              "recovery-code",
              "phone",
              "webauthn-roaming",
              "webauthn-platform",
            ]),
          }
        : undefined;

    return {
      name,
      timestamp: chance.date().toISOString(),
      ...extra,
    };
  }
);
