const test = require("node:test");
const { strictEqual, deepStrictEqual, rejects } = require("node:assert");
const { onExecutePostLogin } = require("./fetch-formdata");

const {
  actionTestSetup,
} = require("@kilterset/auth0-actions-testing/node-test-runner");

test("fetch with FormData (www-form-urlencoded)", async (t) => {
  const { auth0, fetchMock } = await actionTestSetup(t);

  await t.test("service is notified when user logs in", async (t) => {
    fetchMock.mock("https://api.example.com/notify-user-logged-in", 201);

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
      { Authorization: "Bearer shh" },
      "Unexpected headers"
    );

    // Deeply test the body of a FormData request using Object.fromEntries
    deepStrictEqual(
      Object.fromEntries(options.body),
      { id: "007", email: "bond@example.com" },
      "Unexpected body"
    );
  });

  await t.test("log in fails if service is down", async (t) => {
    fetchMock.mock("https://api.example.com/notify-user-logged-in", 500);

    const action = auth0.mock.actions.postLogin();

    await rejects(
      action.simulate(onExecutePostLogin),
      /Post-login notification failed: 500/i
    );
  });
});
