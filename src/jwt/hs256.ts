import { createHmac } from "node:crypto";

export function encodeHS256JWT({
  secret,
  claims,
}: {
  secret: string;
  claims: Record<string, unknown>;
}) {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const body = [header, claims]
    .map((part) => Buffer.from(JSON.stringify(part)).toString("base64url"))
    .join(".");

  const signature = signHS256({ secret, body });

  return `${body}.${signature}`;
}

export function signHS256({ secret, body }: { secret: string; body: string }) {
  return createHmac("sha256", secret).update(body).digest("base64url");
}
