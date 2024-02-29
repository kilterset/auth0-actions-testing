import test from "node:test";
import { deepStrictEqual, ok, strictEqual } from "node:assert";
import { user } from "../../mock/user";
import { identity } from "../../mock/identity";

test("User mock", async (t) => {
  await t.test("generates a realistic user", () => {
    const mock = user();

    const guaranteed = [
      "user_id",
      "email_verified",
      "user_metadata",
      "app_metadata",
      "created_at",
      "updated_at",
    ] as const;

    for (const field of guaranteed) {
      ok(mock[field] !== undefined, `${field} was not present`);
    }
  });

  await t.test("can have properties overridden", () => {
    const overrides = {
      user_id: "custom-id",
      username: "hamlet",
      name: "Hamlet",
      given_name: "Ham",
      family_name: "Let",
      nickname: "hammy",
      email: "hamlet@avon.info",
      email_verified: true,
      phone_number: "+1234567890",
      phone_verified: true,
      picture: "https://example/hamster.jpg",
      app_metadata: {
        custom: "data",
      },
      user_metadata: {
        custom: "data",
      },
      created_at: "2021-01-01T00:00:00.000Z",
      updated_at: "2021-01-01T00:00:00.000Z",
      last_password_reset: undefined,
      identities: [identity()],
      extra_field: "present",
    };

    const actual = user(overrides);

    deepStrictEqual(
      actual,
      overrides,
      "expected properties were not overridden"
    );
  });

  await t.test("name attributes", async (t) => {
    await t.test("are excluded by default", () => {
      const { given_name, family_name } = user();
      ok(given_name === undefined, "given_name was found");
      ok(family_name === undefined, "family_name was found");
    });

    await t.test("can be included", () => {
      const { given_name, family_name } = user({}, { includeFullName: true });
      ok(typeof given_name === "string" && given_name, "given_name absent");
      ok(typeof family_name === "string" && family_name, "family_name absent");
    });

    await t.test("derives name from custom given and family names", () => {
      const { given_name, family_name, name } = user({
        given_name: "Joel",
        family_name: "Miller",
      });

      strictEqual(given_name, "Joel", "given_name was not customized");
      strictEqual(family_name, "Miller", "family_name was not customized");
      strictEqual(name, "Joel Miller", "name was not correctly derived");
    });

    await t.test("can have name customized", () => {
      const { given_name, family_name, name } = user({
        given_name: "Joel",
        family_name: "Miller",
        name: "JM",
      });

      strictEqual(given_name, "Joel", "given_name was not customized");
      strictEqual(family_name, "Miller", "family_name was not customized");
      strictEqual(name, "JM", "name was not customized");
    });
  });

  await t.test("user ID", async (t) => {
    await t.test("matches first identity", () => {
      const { user_id, identities } = user();
      ok(identities, "no identities found");
      const identity = identities[0];

      strictEqual(
        user_id.split("|")[1],
        identity.user_id,
        "user_id does not match identity"
      );
    });

    await t.test("matches customised identity", () => {
      const { user_id } = user({
        identities: [
          identity({ provider: "google-oauth-2", user_id: "g42" }),
          identity({ provider: "windowslive", user_id: "w10" }),
        ],
      });

      strictEqual(user_id, "google-oauth-2|g42", "unexpected user_id");
    });

    await t.test("handles no ID", () => {
      const { user_id } = user({
        identities: [],
      });

      ok(user_id.startsWith("auth0|"), "expected auth0 ID prefix");
    });
  });

  await t.test("email_verified is false when no email is set", async (t) => {
    const { email_verified } = user({ email: undefined });
    strictEqual(email_verified, false, "email_verified was not false");
  });

  await t.test("nickname defaults to first part of email", async (t) => {
    const { nickname } = user({ email: "hello@example.com" });
    strictEqual(nickname, "hello", "nickname was not derived from email");
  });

  await t.test("username", async (t) => {
    await t.test("can be customized", () => {
      const { username } = user({
        username: "custom",
      });

      strictEqual(username, "custom", "nickname was not customized");
    });

    await t.test("can be omitted", () => {
      const { username } = user({
        username: undefined,
      });

      strictEqual(username, undefined, "nickname was not omitted");
    });
  });
});
