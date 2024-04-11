import { ok } from "assert";
import { encodeHS256JWT, signHS256 } from "../../jwt/hs256";
import { Request, User } from "../../types";

interface RedirectMockOptions {
  readonly now?: ConstructorParameters<typeof Date>[0];
  readonly request: Request;
  readonly user: User;
}

interface EncodeTokenOptions {
  expiresInSeconds?: number | undefined;
  payload: {
      [key: string]: unknown;
  };
  secret: string;
}

interface SendUserToOptions {
  query?: Record<string, string>;
}

interface ValidateTokenOptions {
  tokenParameterName?: string;
  secret: string;
}

export function redirectMock(flow: string, { now: nowValue, request, user }: RedirectMockOptions) {
  const now = new Date(nowValue || Date.now());

  const state = {
    target: null as null | { url: URL; queryParams: Record<string, string> },
  };

  const build = <T>(api: T) => ({
    encodeToken: ({ expiresInSeconds, payload, secret }: EncodeTokenOptions) => {
      expiresInSeconds = expiresInSeconds ?? 900;

      const claims = {
        iss: request.hostname,
        iat: Math.floor(now.getTime() / 1000),
        exp: Math.floor((now.getTime() + expiresInSeconds * 1000) / 1000),
        sub: user.user_id,
        ip: request.ip,
        ...payload,
      };

      return encodeHS256JWT({ secret, claims });
    },

    sendUserTo: (urlString: string, options?: SendUserToOptions) => {
      const url = new URL(urlString);

      if (options?.query) {
        for (const [key, value] of Object.entries(options.query)) {
          url.searchParams.append(key, value);
        }
      }

      const queryParams = Object.fromEntries(url.searchParams.entries());

      state.target = { url, queryParams };

      return api;
    },

    validateToken: ({ tokenParameterName, secret }: ValidateTokenOptions) => {
      tokenParameterName = tokenParameterName ?? "session_token";
      const params = { ...request.query, ...request.body };

      const tokenValue = params[tokenParameterName];

      ok(
        tokenParameterName in params,
        `There is no parameter called '${tokenParameterName}' available in either the POST body or query string.`
      );

      const [rawHeader, rawClaims, signature] = String(tokenValue).split(".");

      const verify = (condition: boolean, message: string) => {
        ok(condition, `The session token is invalid: ${message}`);
      };

      const [header, claims] = [rawHeader, rawClaims].map((part) =>
        JSON.parse(Buffer.from(part, "base64url").toString())
      );

      verify(
        claims.state === params.state,
        "State in the token does not match the /continue state."
      );

      const expectedSignature = signHS256({
        secret,
        body: `${rawHeader}.${rawClaims}`,
      });

      verify(signature === expectedSignature, "Failed signature validation");

      const expectedClaims = ["sub", "iss", "exp", "iat"];

      for (const claim of expectedClaims) {
        verify(claim in claims, "Missing or invalid standard claims");
      }

      verify(
        header.typ?.toUpperCase() === "JWT",
        "Unexpected token payload type"
      );

      verify(
        claims.sub === user.user_id,
        "The sub claim does not match the user_id."
      );

      verify(
        claims.exp > Math.floor(now.getTime() / 1000),
        "Token has expired."
      );

      return claims as Record<string, unknown>;
    },
  });

  return { state, build };
}
