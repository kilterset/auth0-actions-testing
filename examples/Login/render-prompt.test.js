const test = require("node:test");
const { strictEqual } = require("node:assert");
const { onExecutePostLogin } = require("./render-prompt");
const { nodeTestRunner } = require("@kilterset/auth0-actions-testing");

test("rendering a prompt", async (t) => {
  const { auth0 } = await nodeTestRunner.actionTestSetup(t);

  await t.test("renders a prompt", async () => {
    const action = auth0.mock.actions.postLogin();

    await action.simulate(onExecutePostLogin);

    const { rendered } = action.prompt;

    strictEqual(
      rendered.promptId,
      "test-prompt-id",
      "Expected prompt ID to be `test-prompt-id`"
    );
  });
});
