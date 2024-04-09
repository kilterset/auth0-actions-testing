const test = require("node:test");
const { strictEqual, ok } = require("node:assert");
const { onPostChallenge } = require("./deny-password-reset");
const { nodeTestRunner } = require("@kilterset/auth0-actions-testing");

test("deny with a password reset", async (t) => {
  const { auth0 } = await nodeTestRunner.actionTestSetup(t);

  await t.test("denies non ring-bearers", async (t) => {
    const action = auth0.mock.actions.postChallenge({
      secrets: { RING_BEARER: "frodo" },
      user: auth0.mock.user({ name: "nazgûl" }),
    });

    await action.simulate(onPostChallenge);

    ok(action.access.denied, "Unexpected to be denied");

    strictEqual(
      action.access.denied.reason,
      "Go away!",
      "Unexpected denial reason"
    );
  });

  await t.test("permits ring-bearers", async (t) => {
    const action = auth0.mock.actions.postChallenge({
      secrets: { RING_BEARER: "frodo" },
      user: auth0.mock.user({ name: "frodo" }),
    });

    await action.simulate(onPostChallenge);

    ok(!action.access.denied, "Unexpectedly denied");
  });
});
