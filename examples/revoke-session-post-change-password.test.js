const test = require("node:test");
const { strictEqual, deepStrictEqual } = require("node:assert");
const {
  onExecutePostChangePassword,
} = require("./revoke-session-post-change-password");
const { nodeTestRunner } = require("@kilterset/auth0-actions-testing");

test("post change password", async (t) => {
  const { auth0, fetchMock } = await nodeTestRunner.actionTestSetup(t);

  await t.test("revokes remote session", async (t) => {
    fetchMock.mock("https://api.example/revoke-session", 200);

    const action = auth0.mock.actions.postChangePassword({
      secrets: { API_BASE_URL: "https://api.example", API_SECRET: "shh" },
      user: auth0.mock.user({ id: 42 }),
    });

    await action.simulate(onExecutePostChangePassword);

    const calls = fetchMock.calls();

    strictEqual(calls.length, 1, "Expected 1 fetch call to be made.");

    const [url, options] = calls[0];

    strictEqual(url, "https://api.example/revoke-session", "Unexpected URL");
    strictEqual(options.method, "POST", "Unexpected request method");

    deepStrictEqual(
      options.headers,
      { Authorization: "Bearer shh", "Content-Type": "application/json" },
      "Unexpected headers"
    );

    deepStrictEqual(
      JSON.parse(options.body),
      { userId: 42 },
      "Unexpected body"
    );
  });
});
