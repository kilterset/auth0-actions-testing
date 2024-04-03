const test = require("node:test");
const { ok, strictEqual } = require("node:assert");
const { onExecutePostLogin } = require("./app-metadata");

const {
  actionTestSetup,
} = require("@kilterset/auth0-actions-testing/node-test-runner");

test("setting app metadata", async (t) => {
  const { auth0 } = await actionTestSetup(t);

  await t.test("records a lucky number", async () => {
    const action = auth0.mock.actions.postLogin({
      secrets: { MAX_LUCKY_NUMBER: 42 },
      user: auth0.mock.user({
        app_metadata: {},
      }),
    });

    await action.simulate(onExecutePostLogin);

    const { lucky_number } = action.user.app_metadata;

    ok(
      typeof lucky_number === "number",
      `Expected the user's lucky number to be a number (got ${lucky_number})`
    );

    ok(
      lucky_number <= 42,
      `Expected lucky number not to exceed the maximum allowed (got ${lucky_number})`
    );
  });

  await t.test("does not overwrite lucky numbers", async () => {
    const action = auth0.mock.actions.postLogin({
      secrets: { MAX_LUCKY_NUMBER: 42 },
      user: auth0.mock.user({
        app_metadata: { lucky_number: 17 },
      }),
    });

    await action.simulate(onExecutePostLogin);

    const { lucky_number } = action.user.app_metadata;

    strictEqual(
      lucky_number,
      17,
      `Expected the user's lucky number to be unchanged`
    );
  });
});
