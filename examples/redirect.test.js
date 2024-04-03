const test = require("node:test");
const { strictEqual, deepStrictEqual, ok, strict } = require("node:assert");
const { onExecutePostLogin, onContinuePostLogin } = require("./redirect");

const {
  signHS256,
  encodeHS256JWT,
  decodeJWTPayload,
} = require("@kilterset/auth0-actions-testing/jwt");

const {
  actionTestSetup,
} = require("@kilterset/auth0-actions-testing/node-test-runner");

test("redirect and continue with signed data", async (t) => {
  const { auth0 } = await actionTestSetup(t);

  await t.test("redirects with signed data", async (t) => {
    const action = auth0.mock.actions.postLogin({
      secrets: { REDIRECT_SECRET: "shh" },
      user: auth0.mock.user({ user_id: "007", name: "Bond" }),
      request: auth0.mock.request({
        ip: "b57d:c61d:34ac:b57d:9798:7721:88ea:78c4",
      }),
    });

    await action.simulate(onExecutePostLogin);

    // Test the redirect URL
    const { redirect } = action;

    strict(
      redirect.queryParams.theme,
      "spiffy",
      "Unexpected value for `theme` query parameter"
    );

    strictEqual(
      // You can also use redirect.url.href to get the full URL as a string
      redirect.url.origin,
      "https://example.com",
      "Unexpected redirect URL origin"
    );

    strictEqual(
      redirect.url.pathname,
      "/sandwich-preferences",
      "Unexpected redirect URL path"
    );

    // Test the signed JWT data payload
    const { session_token } = redirect.queryParams;

    const decoded = decodeJWTPayload(session_token);

    strictEqual(decoded.sub, "007", "Unexpected sub claim");

    strictEqual(
      decoded.ip,
      "b57d:c61d:34ac:b57d:9798:7721:88ea:78c4",
      "Unexpected IP address claim"
    );

    strictEqual(decoded.name, "Bond", "Unexpected name claim");

    // Test the JWT was signed with the correct shared secret
    const [header, payload, signature] = session_token.split(".");
    const body = `${header}.${payload}`;
    const expectedSignature = signHS256({ body, secret: "shh" });
    strictEqual(signature, expectedSignature, "Unexpected JWT signature");
  });

  await t.test("continues with signed data", async (t) => {
    // Your app builds and signs this JWT using the shared REDIRECT_SECRET

    const claims = {
      sub: "007", // must match the original user ID
      state: "original-state-param-value", // what was sent in the redirect
      iss: "myapp.com",
      iat: new Date().getTime() / 1000,
      exp: new Date().getTime() / 1000 + 60, // expires in 60 seconds
      sandwich: "tuna", // custom claim
    };

    const jwtFromApp = encodeHS256JWT({ claims, secret: "shh" });

    // Then your app redirects the user back to the continue URL with the state

    const action = auth0.mock.actions.postLogin({
      secrets: { REDIRECT_SECRET: "shh" },
      user: auth0.mock.user({ user_id: "007" }),
      request: auth0.mock.request({
        query: {
          // Your app passes the original state. For testing purposes, we treat
          // this value as the valid state for the JWT.
          state: "original-state-param-value",
          some_token: jwtFromApp,
        },
      }),
    });

    await action.simulate(onContinuePostLogin);

    // Test that the user metadata was set

    deepStrictEqual(
      action.user.user_metadata,
      { preferredSandwich: "tuna" },
      "Unexpected user metadata"
    );
  });
});
