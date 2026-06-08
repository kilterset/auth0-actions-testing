/**
 * Shows how to use transaction metadata to share state between Actions in the
 * same login flow. Here we record that a step-up check has run, so a later
 * Action in the sequence can read it back and avoid repeating the work.
 */
exports.onExecutePostLogin = async (event, api) => {
  if (event.transaction?.metadata?.step_up_completed === "true") {
    // A previous Action in this transaction already handled step-up.
    return;
  }

  api.transaction.setMetadata("step_up_completed", "true");
};
