exports.onExecuteCredentialsExchange = async (event, api) => {
  if (event.request.geoip.continentCode === "NA") {
    api.access.deny("invalid_request", "Access from North America is not allowed.");
  }
};
