const test = require("node:test");
const { ok, deepStrictEqual } = require("node:assert");
const { onExecuteCredentialsExchange } = require("./geo-filter");
const { nodeTestRunner } = require("@kilterset/auth0-actions-testing");

test("Filter access based on continent code", async (t) => {
  const { auth0 } = await nodeTestRunner.actionTestSetup(t);

  await t.test("denies North America", async () => {
    const action = auth0.mock.actions.credentialsExchange({
      request: { geoip: { continentCode: "NA" } },
    });

    await action.simulate(onExecuteCredentialsExchange);

    ok(action.access.denied, "Expected access to be denied");

    deepStrictEqual(
      action.access.denied,
      {
        code: "invalid_request",
        reason: "Access from North America is not allowed.",
      },
      "Unexpected denial"
    );
  });

  await t.test("allows New Zealand", async () => {
    const action = auth0.mock.actions.credentialsExchange({
      request: { geoip: { continentCode: "NZ" } },
    });

    await action.simulate(onExecuteCredentialsExchange);

    ok(!action.access.denied, "Expected access to be allowed");
  });
});
