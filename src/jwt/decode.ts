/**
 * Decodes a JWT payload without verifying signature or claims.
 */
export function decodeJWTPayload(jwt: string) {
  const [, payload] = jwt.split(".");
  return JSON.parse(Buffer.from(payload, "base64url").toString());
}
