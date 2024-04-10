/**
 * Revoke a session from a remote API after a user changes their password.
 */
exports.onExecutePostChangePassword = async (event) => {
  const { API_BASE_URL, API_SECRET } = event.secrets;
  const url = new URL("/revoke-session", API_BASE_URL);

  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: event.user.id }),
  });
};
