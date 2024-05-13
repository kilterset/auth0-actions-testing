/**
 * Denies user registration if the user is from the wrong domain.
 */
exports.onExecutePreUserRegistration = async (event, api) => {
  const emailDomain = event.user.email.split("@")[1];

  if (event.secrets.ALLOWED_DOMAIN !== emailDomain) {
    api.access.deny("invalid_domain", "External email domains are not allowed");
  }
};
