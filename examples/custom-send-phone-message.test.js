const test = require("node:test");
const { strictEqual, deepStrictEqual } = require("node:assert");
const { onExecuteSendPhoneMessage } = require("./custom-send-phone-message");
const { nodeTestRunner } = require("@kilterset/auth0-actions-testing");

test("send phone message", async (t) => {
  const { auth0, fetchMock } = await nodeTestRunner.actionTestSetup(t);

  await t.test("is handled by a custom API", async (t) => {
    fetchMock.mock("https://sms-provider/send-sms", 200);

    const action = auth0.mock.actions.postChangePassword({
      secrets: { API_BASE_URL: "https://sms-provider", API_SECRET: "shh" },
      message_options: auth0.mock.phoneMessageOptions({
        recipient: "+17762323",
        text: "Here is your code",
      }),
    });

    await action.simulate(onExecuteSendPhoneMessage);

    const calls = fetchMock.calls();

    strictEqual(calls.length, 1, "Expected 1 fetch call to be made.");

    const [url, options] = calls[0];

    strictEqual(url, "https://sms-provider/send-sms", "Unexpected URL");
    strictEqual(options.method, "POST", "Unexpected request method");

    deepStrictEqual(
      options.headers,
      { Authorization: "Bearer shh", "Content-Type": "application/json" },
      "Unexpected headers"
    );

    deepStrictEqual(
      JSON.parse(options.body),
      { phoneNumber: "+17762323", message: "Here is your code" },
      "Unexpected body"
    );
  });
});
