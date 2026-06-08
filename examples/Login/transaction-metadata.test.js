const test = require("node:test");
const { strictEqual, deepStrictEqual } = require("node:assert");
const { onExecutePostLogin } = require("./transaction-metadata");
const { nodeTestRunner } = require("@kilterset/auth0-actions-testing");

test("transaction metadata", async (t) => {
  const { auth0 } = await nodeTestRunner.actionTestSetup(t);

  await t.test("records the step-up check on the transaction", async () => {
    const action = auth0.mock.actions.postLogin();

    await action.simulate(onExecutePostLogin);

    // The value written via `api.transaction.setMetadata` is readable on the
    // event, mirroring how a later Action in the flow would see it.
    strictEqual(
      action.event.transaction.metadata.step_up_completed,
      "true"
    );
    strictEqual(action.transaction.metadata.step_up_completed, "true");
  });

  await t.test("does nothing when step-up already recorded", async () => {
    const action = auth0.mock.actions.postLogin({
      transaction: auth0.mock.transaction({
        metadata: { step_up_completed: "true" },
      }),
    });

    await action.simulate(onExecutePostLogin);

    deepStrictEqual(action.transaction.metadata, {
      step_up_completed: "true",
    });
  });
});
