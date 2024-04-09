import test from "node:test";
import { strictEqual, deepStrictEqual, throws, ok } from "node:assert";
import { postChallenge } from "../../mock/api";
import { request, user } from "../../mock";
import { encodeHS256JWT } from "../../jwt/hs256";

test("Post Challenge API", async (t) => {
  await t.test("access", async (t) => {
    const { implementation: api, state } = postChallenge();

    strictEqual(api.access.deny("Only cool kids allowed"), api);

    deepStrictEqual(state.access.denied, {
      reason: "Only cool kids allowed",
    });
  });

  await t.test("authentication", async (t) => {
    await t.test("challenge", async (t) => {
      await t.test("is false by default", async (t) => {
        const { implementation: api, state } = postChallenge();
        strictEqual(state.authentication.challenge, false);
      });

      await t.test("can be set with a default", async (t) => {
        const { implementation: api, state } = postChallenge();

        strictEqual(
          api.authentication.challengeWith({ type: "otp" }),
          undefined
        );

        deepStrictEqual(state.authentication.challenge, {
          default: { type: "otp" },
          allOptions: [{ type: "otp" }],
        });
      });

      await t.test("can be set with a default and alternatives", async (t) => {
        const { implementation: api, state } = postChallenge();

        strictEqual(
          api.authentication.challengeWith(
            {
              type: "phone",
              options: { preferredMethod: "voice" },
            },
            {
              additionalFactors: [
                { type: "email" },
                { type: "webauthn-roaming" },
              ],
            }
          ),
          undefined
        );

        deepStrictEqual(state.authentication.challenge, {
          default: {
            type: "phone",
            options: { preferredMethod: "voice" },
          },
          allOptions: [
            {
              type: "phone",
              options: { preferredMethod: "voice" },
            },
            { type: "email" },
            { type: "webauthn-roaming" },
          ],
        });
      });

      await t.test("can be set with options and no default", async (t) => {
        const { implementation: api, state } = postChallenge();

        const factors = [{ type: "email" }, { type: "webauthn-roaming" }];

        strictEqual(api.authentication.challengeWithAny(factors), undefined);

        deepStrictEqual(state.authentication.challenge, {
          default: undefined,
          allOptions: factors,
        });
      });
    });
  });

  await t.test("redirect", async (t) => {
    await t.test("sendUserTo", async (t) => {
      await t.test("simple redirect", async (t) => {
        const { implementation: api, state } = postChallenge();

        strictEqual(api.redirect.sendUserTo("https://example.com/r"), api);

        const { redirect } = state;

        ok(redirect, "redirect not set");
        deepStrictEqual(redirect.queryParams, {}, "query should be empty");
        strictEqual(redirect.url.href, "https://example.com/r", "url mismatch");
      });

      await t.test("redirect with consolidated GET parameters", async (t) => {
        const { implementation: api, state } = postChallenge();

        strictEqual(
          api.redirect.sendUserTo("https://example.com?bread=rye", {
            query: { filling: "cheese", spread: "butter" },
          }),
          api
        );

        const { redirect } = state;

        ok(redirect, "redirect not set");

        deepStrictEqual(
          redirect.queryParams,
          { bread: "rye", filling: "cheese", spread: "butter" },
          "unexpected query"
        );

        strictEqual(
          redirect.url.href,
          "https://example.com/?bread=rye&filling=cheese&spread=butter",
          "url mismatch"
        );
      });
    });

    await t.test("encodeToken", async (t) => {
      const now = new Date("2024-01-01T00:00:00.000Z");
      const nowUnixTimestamp = now.getTime() / 1000;

      const { implementation: api } = postChallenge({
        request: request({
          hostname: "example.com",
          ip: "d666:171e:e7a4:1aa3:359a:a317:9f53:ee97",
        }),
        user: user({ user_id: "auth0|8150" }),
        now,
      });

      const token = api.redirect.encodeToken({
        expiresInSeconds: 42,
        payload: { foo: "bar" },
        secret: "shh",
      });

      const [header, payload, signature] = token.split(".");

      const decodedHeader = JSON.parse(atob(header));
      const decodedPayload = JSON.parse(atob(payload));

      deepStrictEqual(
        decodedHeader,
        { alg: "HS256", typ: "JWT" },
        "unexpected JWT header"
      );

      deepStrictEqual(
        decodedPayload,
        {
          iss: "example.com",
          iat: nowUnixTimestamp,
          exp: nowUnixTimestamp + 42,
          sub: "auth0|8150",
          ip: "d666:171e:e7a4:1aa3:359a:a317:9f53:ee97",
          foo: "bar",
        },
        "unexpected claims"
      );

      strictEqual(
        signature,
        "ZlLKLk7uJzDjD0nt2a08QiWMY1EPnhFIuc8WsSZPBvQ",
        "invalid signature"
      );
    });

    await t.test("validateToken", async (t) => {
      const VALID_SECRET = "shh";

      const TOKEN_PAYLOAD = {
        sub: "auth0|7321",
        iss: "myapp.com",
        iat: 1711509300,
        exp: 1711509800,
        state: "opaque-random-state",
        foo: "bar",
      };

      const VALID_STATE = TOKEN_PAYLOAD.state;

      const VALID_TOKEN = encodeHS256JWT({
        secret: VALID_SECRET,
        claims: TOKEN_PAYLOAD,
      });

      const VALID_CONTEXT = {
        now: TOKEN_PAYLOAD.iat * 1000,
        user: user({ user_id: TOKEN_PAYLOAD.sub }),
        request: request({
          method: "POST",
          body: {
            session_token: VALID_TOKEN,
            state: VALID_STATE,
          },
        }),
      } as const;

      await t.test("decodes a valid POST token", async (t) => {
        const { now, user } = VALID_CONTEXT;

        const { implementation: api } = postChallenge({
          now,
          user,
          request: request({
            method: "POST",
            body: {
              session_token: VALID_TOKEN,
              state: VALID_STATE,
            },
          }),
        });

        const payload = api.redirect.validateToken({ secret: VALID_SECRET });

        deepStrictEqual(payload, TOKEN_PAYLOAD, "unexpected payload");
      });

      await t.test("decodes a valid GET token", async (t) => {
        const { now, user } = VALID_CONTEXT;

        const { implementation: api } = postChallenge({
          now,
          user,
          request: request({
            method: "GET",
            query: {
              session_token: VALID_TOKEN,
              state: VALID_STATE,
            },
          }),
        });

        const payload = api.redirect.validateToken({ secret: VALID_SECRET });

        deepStrictEqual(payload, TOKEN_PAYLOAD, "unexpected payload");
      });

      await t.test("can use an alternative parameter", async (t) => {
        const { now, user } = VALID_CONTEXT;

        const { implementation: api } = postChallenge({
          now,
          user,
          request: request({
            method: "POST",
            body: {
              a_token_param: VALID_TOKEN,
              state: VALID_STATE,
            },
          }),
        });

        const payload = api.redirect.validateToken({
          secret: VALID_SECRET,
          tokenParameterName: "a_token_param",
        });

        deepStrictEqual(payload, TOKEN_PAYLOAD, "unexpected payload");
      });

      await t.test("throws error if state is mismatched", async (t) => {
        const context = structuredClone(VALID_CONTEXT);
        context.request.body.state = "mismatched-from-token-value";

        const { implementation: api } = postChallenge(context);

        throws(
          () => api.redirect.validateToken({ secret: VALID_SECRET }),
          /state in the token/i
        );
      });

      await t.test("throws error if param is missing", async (t) => {
        const { implementation: api } = postChallenge(VALID_CONTEXT);

        throws(
          () =>
            api.redirect.validateToken({
              secret: VALID_SECRET,
              tokenParameterName: "a_token_param",
            }),
          /no parameter called 'a_token_param'/i
        );
      });

      await t.test("throws error if expired", async (t) => {
        const { user, request } = VALID_CONTEXT;

        const { implementation: api } = postChallenge({
          now: TOKEN_PAYLOAD.exp * 1000, // exactly the expiry time
          user,
          request,
        });

        throws(
          () => api.redirect.validateToken({ secret: VALID_SECRET }),
          /expired/i
        );
      });

      await t.test("throws error if signature is invalid", async (t) => {
        const context = structuredClone(VALID_CONTEXT);
        context.request.body.session_token = VALID_TOKEN.replace(
          /\.[^.]+$/,
          ".badsignature"
        );

        const { implementation: api } = postChallenge(context);

        throws(
          () => api.redirect.validateToken({ secret: VALID_SECRET }),
          /signature/i
        );
      });

      for (const claim of ["sub", "iss", "iat", "exp"]) {
        await t.test(`throws error if ${claim} is missing`, async (t) => {
          const context = structuredClone(VALID_CONTEXT);

          const claims = structuredClone(TOKEN_PAYLOAD) as Record<
            string,
            unknown
          >;

          ok(claim in claims, "claim not in payload");
          delete claims[claim];

          context.request.body.session_token = encodeHS256JWT({
            secret: VALID_SECRET,
            claims,
          });

          const { implementation: api } = postChallenge(context);

          throws(
            () => api.redirect.validateToken({ secret: VALID_SECRET }),
            /missing or invalid standard claims/i
          );
        });
      }
    });
  });

  await t.test("cache", async (t) => {
    await t.test("can set cache", async (t) => {
      const { implementation: api, state } = postChallenge();
      strictEqual(api.cache.set("location", "Ōtautahi").type, "success");
      deepStrictEqual(state.cache.get("location"), "Ōtautahi");
    });

    await t.test("can get cache", async (t) => {
      const { implementation: api, state } = postChallenge({
        cache: { location: "Ōtautahi" },
      });

      strictEqual(state.cache.get("location"), "Ōtautahi");
      strictEqual(state.cache.get("nonexistent"), undefined);
    });
  });
});
