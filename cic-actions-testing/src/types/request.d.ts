export interface Request {
  ip: string;
  asn?: string;

  /** The HTTP method used for the request */
  method: string;

  /** The query string parameters sent to the the authorization request. */
  query: Record<string, unknown>;

  /** The body of the POST request. This data will only be available during refresh token and Client Credential Exchange flows and Post Login Action. */
  body: Record<string, unknown>;

  geoip: Partial<{
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
    [additionalProperties: string]: unknown;
  }>;

  /** The hostname that is being used for the authentication flow. */
  hostname?: string;

  /** The language requested by the browser. */
  language?: string;

  user_agent?: string;
}
