/**
 * Send an SMS message using a custom API.
 */
exports.onExecuteSendPhoneMessage = async (event) => {
  const { API_BASE_URL, API_SECRET } = event.secrets;
  const url = new URL("/send-sms", API_BASE_URL);

  const payload = {
    message: event.message_options.text,
    phoneNumber: event.message_options.recipient,
  };

  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};
