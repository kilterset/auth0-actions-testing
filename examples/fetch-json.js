/**
 * Makes a POST request to a remote service every time a user logs in. This
 * example shows how to make an JSON POST request and halt the login process via
 * an exception.
 */
exports.onExecutePostLogin = async (event, api) => {
  const url = "https://api.example.com/notify-user-logged-in";

  const headers = {
    Authorization: "Bearer " + event.secrets.API_KEY,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    id: event.user.user_id,
    email: event.user.email,
  });

  const response = await fetch(url, { method: "POST", headers, body });
  const responseJSON = await response.json();

  if (responseJSON.problem) {
    // Throwing an error will prevent the login from succeeding. The alternative
    // is to log the error and continue.
    throw new Error(`Post-login notification failed: ${responseJSON.problem}`);
  }
};
