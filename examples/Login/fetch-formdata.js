/**
 * Makes a POST request to a remote service every time a user logs in. This
 * example shows how to make an www-form-urlencoded POST request using FormData
 * and halting the login process via an exception.
 */
exports.onExecutePostLogin = async (event, api) => {
  const body = new FormData();
  body.append("id", event.user.user_id);
  body.append("email", event.user.email);

  const url = "https://api.example.com/notify-user-logged-in";

  const response = await fetch(url, {
    headers: { Authorization: "Bearer " + event.secrets.API_KEY },
    method: "POST",
    body,
  });

  if (!response.ok) {
    // Throwing an error will prevent the login from succeeding. The alternative
    // is to log the error and continue.
    throw new Error(
      `Post-login notification failed: ${response.status} ${response.statusText}`
    );
  }
};
