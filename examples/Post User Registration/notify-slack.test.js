const test = require("node:test");
const { strictEqual, deepStrictEqual } = require("node:assert");
const { onExecutePostUserRegistration } = require("./notify-slack");
const { nodeTestRunner } = require("@kilterset/auth0-actions-testing");

test("post user registration", async (t) => {
  const { auth0, fetchMock } = await nodeTestRunner.actionTestSetup(t);

  await t.test("service is notified when user logs in", async (t) => {
    fetchMock.mock("https://slack/hook", 201);

    const action = auth0.mock.actions.postUserRegistration({
      secrets: { SLACK_WEBHOOK_URL: "https://slack/hook" },
      user: auth0.mock.user({ email: "ellie@example.com" }),
    });

    await action.simulate(onExecutePostUserRegistration);

    const calls = fetchMock.calls();

    strictEqual(calls.length, 1, "Expected 1 fetch call to be made.");

    const [url, options] = calls[0];

    strictEqual(url, "https://slack/hook", "Unexpected URL");
    strictEqual(options.method, "POST", "Unexpected request method");

    deepStrictEqual(
      options.headers,
      { "Content-Type": "application/json" },
      "Unexpected headers"
    );

    deepStrictEqual(
      JSON.parse(options.body),
      { text: "New User: ellie@example.com" },
      "Unexpected body"
    );
  });
});
