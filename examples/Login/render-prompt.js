/**
 * Shows how to test the rendering of a prompt.
 */
exports.onExecutePostLogin = async (event, api) => {
  api.prompt.render("test-prompt-id");
};
