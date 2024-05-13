/**
 * Shows how to redirect the user to a specific URL as part of the login flow,
 * passing extra parameters with a signed JWT, and then how to handle signed
 * data sent back during continuation of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // The purpose of this token is only as a way to pass some information to the
  // redirect URL. While you could do this with query parameters, using a signed
  // JWT ensures that your app can verify the data hasn't been tampered with. In
  // your app, take the JWT and verify it using the same REDIRECT_SECRET used to
  // sign it. The algorithm used is HS256.
  const jwt = api.redirect.encodeToken({
    secret: event.secrets.REDIRECT_SECRET,
    expiresInSeconds: 60,
    payload: {
      ip: event.request.ip,
      name: event.user.name,
    },
  });

  api.redirect.sendUserTo("https://example.com/sandwich-preferences", {
    // Query parameters sent to the URL (excluding the `state` parameter which
    // is automatically added by Auth0).
    query: { session_token: jwt, theme: "spiffy" },
  });
};

exports.onContinuePostLogin = async (event, api) => {
  // To pass signed information back from the redirect URL, you can pass a JWT
  // in the query parameters. The JWT is built by your app, and must contain a
  // `state` claim identical to the one sent in the continue URL as well as a
  // `sub` claim that matches the event's user ID.
  const payload = api.redirect.validateToken({
    secret: event.secrets.REDIRECT_SECRET,
    tokenParameterName: "some_token",
  });

  api.user.setUserMetadata("preferredSandwich", payload.sandwich);
};
