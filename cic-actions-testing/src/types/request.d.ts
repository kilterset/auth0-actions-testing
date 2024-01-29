export interface Request {
  ip: string;
  asn: string;
  method: string;
  query: {
    protocol: string;
    client_id: string;
    response_type: string;
    connection: string;
    prompt: string;
    scope: string;
    redirect_uri: string;
  };
  body: {
    [key: string]: string;
  };
  geoip: {
    cityName: string;
    continentCode: string;
    countryCode3: string;
    countryCode: string;
    countryName: string;
    latitude: number;
    longitude: number;
    subdivisionCode: string;
    subdivisionName: string;
    timeZone: string;
  };
  hostname: string;
  language: string;
  user_agent: string;
}
