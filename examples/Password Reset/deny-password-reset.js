/**
 * Denies a password reset if the user is not the ring bearer.
 */
exports.onPostChallenge = async (event, api) => {
  if (event.secrets.RING_BEARER !== event.user.name) {
    api.access.deny("Go away!");
  }
};
