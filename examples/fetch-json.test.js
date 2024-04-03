const test = require("node:test");
const { strictEqual, deepStrictEqual, rejects } = require("node:assert");
const { onExecutePostLogin } = require("./fetch-json");
const { nodeTestRunner } = require("@kilterset/auth0-actions-testing");

test("fetch with JSON", async (t) => {
  const { auth0, fetchMock } = await nodeTestRunner.actionTestSetup(t);

  await t.test("service is notified when user logs in", async (t) => {
    const responseJSON = { notificationWasSuccessful: true };

    fetchMock.mock(
      "https://api.example.com/notify-user-logged-in",
      responseJSON
    );

    const action = auth0.mock.actions.postLogin({
      secrets: { API_KEY: "shh" },
      user: auth0.mock.user({ user_id: "007", email: "bond@example.com" }),
    });

    await action.simulate(onExecutePostLogin);

    const calls = fetchMock.calls();

    strictEqual(calls.length, 1, "Expected 1 fetch call to be made.");

    const [url, options] = calls[0];

    strictEqual(
      url,
      "https://api.example.com/notify-user-logged-in",
      "Unexpected URL"
    );

    strictEqual(options.method, "POST", "Unexpected request method");

    deepStrictEqual(
      options.headers,
      { Authorization: "Bearer shh", "Content-Type": "application/json" },
      "Unexpected headers"
    );

    deepStrictEqual(
      JSON.parse(options.body),
      { id: "007", email: "bond@example.com" },
      "Unexpected body"
    );
  });

  await t.test("log in fails if problem is in JSON response", async (t) => {
    fetchMock.mock("https://api.example.com/notify-user-logged-in", {
      problem: "kaboom",
    });

    const action = auth0.mock.actions.postLogin();

    await rejects(
      action.simulate(onExecutePostLogin),
      /Post-login notification failed: kaboom/i
    );
  });
});
