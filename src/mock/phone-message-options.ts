import Auth0 from "../types";
import { chance } from "./chance";
import { define } from "./define";

export const phoneMessageOptions = define<
  Auth0.Events.SendPhoneMessage["message_options"]
>(() => {
  return {
    action: chance.pickone(["enrollment", "second-factor-authentication"]),
    code: chance.string({ length: 6, pool: "0123456789" }),
    message_type: chance.pickone(["sms", "voice"]),
    recipient: chance.phone(),
    text: chance.sentence(),
  };
});
