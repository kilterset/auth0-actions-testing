const externalDependency = require("dependency-a");
require("dependency-b");

exports.onExecutePostUserRegistration = async (event, api) => {
  const secret = event.secrets.DANGER_ZONE;

  if (externalDependency(secret) && event.secrets.EJECTOR_SEAT) {
    return;
  }
};
