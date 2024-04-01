import Auth0 from "../types";
import { chance } from "./chance";
import { define } from "./define";
import { identity } from "./identity";

interface UserTransientParams {
  includeFullName: boolean;
}

export const user = define<Auth0.User, UserTransientParams>(
  ({ transientParams, params }) => {
    // If the key is present in the params, use that value. Otherwise, randomly
    // pick between a value and undefined.
    const perhapsFallback = <T>(key: string, value: T) =>
      params.hasOwnProperty(key)
        ? params[key]
        : chance.pickone([undefined, value]);

    const includeFullName =
      params.given_name ||
      params.family_name ||
      transientParams.includeFullName;

    const given_name = params.given_name || chance.first();
    const family_name = params.family_name || chance.last();

    const potentialName = `${given_name} ${family_name}`;

    const name = includeFullName
      ? params.name || potentialName
      : chance.pickone([undefined, potentialName]);

    let fullNameAttributes;

    if (includeFullName) {
      fullNameAttributes = {
        given_name,
        family_name,
      };
    }

    const potentialUsername = [given_name, family_name]
      .map((part) => part.toLowerCase().replace(/[^a-z]/g, ""))
      .join(".");

    const username = perhapsFallback("username", potentialUsername);

    const email = params.hasOwnProperty("email")
      ? params.email
      : chance.email();

    const email_verified = email ? chance.bool() : false;

    const identities = params.identities || [identity()];
    const firstIdentity = identities[0];

    let user_id;

    if (firstIdentity) {
      user_id = `${firstIdentity.provider}|${firstIdentity.user_id}`;
    } else {
      user_id = `auth0|${chance.hash({ length: 24 })}`;
    }

    // "By default, the local part of the user's email."
    const nickname =
      params.nickname ||
      (email
        ? email.split("@")[0]
        : chance.pickone([undefined, chance.word()]));

    const [earliestDate, middleDate, latestDate] = chance
      .n(chance.date, 3)
      .sort()
      .map((date) => (date as Date).toISOString());

    const created_at = earliestDate;
    const updated_at = latestDate;
    const last_password_reset = chance.pickone([undefined, middleDate]);

    const phone_number = perhapsFallback("phone_number", chance.phone());
    const phone_verified = params.hasOwnProperty("phone_verified")
      ? params.phone_verified
      : phone_number
      ? chance.bool()
      : undefined;

    const picture = perhapsFallback(
      "picture",
      chance.avatar({ protocol: "https", email })
    );

    return {
      user_id,
      username,
      name,
      ...fullNameAttributes,
      nickname,
      email,
      email_verified,
      phone_number,
      phone_verified,
      picture,
      app_metadata: {},
      user_metadata: {},
      created_at,
      updated_at,
      last_password_reset,
      identities,
    };
  }
);
