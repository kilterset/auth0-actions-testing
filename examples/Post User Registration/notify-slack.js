/**
 * Notify a Slack channel when a new user registers.
 */
exports.onExecutePostUserRegistration = async (event) => {
  const payload = {
    text: `New User: ${event.user.email}`,
  };

  await fetch(event.secrets.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};
