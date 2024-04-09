const test = require("node:test");
const { deepStrictEqual, ok } = require("node:assert");
const {
  onExecutePreUserRegistration,
} = require("./deny-pre-user-registration");
const { nodeTestRunner } = require("@kilterset/auth0-actions-testing");

test("denies user registration", async (t) => {
  const { auth0 } = await nodeTestRunner.actionTestSetup(t);

  await t.test("denies non Lumon employees", async (t) => {
    const action = auth0.mock.actions.preUserRegistration({
      secrets: { ALLOWED_DOMAIN: "lumon.severance" },
      user: auth0.mock.user({ email: "outie@example.com" }),
    });

    await action.simulate(onExecutePreUserRegistration);

    ok(action.access.denied, "Unexpected to be denied");

    deepStrictEqual(
      action.access.denied,
      {
        code: "invalid_domain",
        reason: "External email domains are not allowed",
      },
      "Unexpected denial reason"
    );
  });

  await t.test("permits Lumon employees", async (t) => {
    const action = auth0.mock.actions.preUserRegistration({
      secrets: { ALLOWED_DOMAIN: "lumon.severance" },
      user: auth0.mock.user({ email: "innie@lumon.severance" }),
    });

    await action.simulate(onExecutePreUserRegistration);

    ok(!action.access.denied, "Unexpectedly denied");
  });
});
