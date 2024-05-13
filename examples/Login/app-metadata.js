/**
 * Shows how to set app metadata for a user after they log in, provided it
 * hasn't already been set.
 */
exports.onExecutePostLogin = async (event, api) => {
  if (event.user.app_metadata["lucky_number"]) {
    // Do nothing. User already has a lucky number.
    return;
  }

  const diceRoll = Math.round(Math.random() * event.secrets.MAX_LUCKY_NUMBER);

  api.user.setAppMetadata("lucky_number", diceRoll);
};
