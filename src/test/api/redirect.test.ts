import test from "node:test";
import { redirectMock } from "../../mock/api/redirect";
import { request as mockRequest, user as mockUser } from "../../mock";
import { deepStrictEqual, ok, strictEqual, throws } from "node:assert";
import { encodeHS256JWT } from "../../jwt";

test("redirect", async (t) => {
  const baseApi = Symbol("Base API");

  await t.test("encodeToken", async (t) => {
    const now = new Date("2024-01-01T00:00:00.000Z");
    const nowUnixTimestamp = now.getTime() / 1000;
    const request = mockRequest({
      hostname: "example.com",
      ip: "d666:171e:e7a4:1aa3:359a:a317:9f53:ee97",
    });
    const user = mockUser({ user_id: "auth0|8150" });
    const { build, state } = redirectMock("Another Flow", { now, request, user });
    const api = build(baseApi);

    const token = api.encodeToken({
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

  await t.test("sendUserTo", async (t) => {
    await t.test("simple redirect", async (t) => {
      const now = new Date();
      const request = mockRequest();
      const user = mockUser();
      const { build, state } = redirectMock("Another Flow", { now, request, user });
      const api = build(baseApi);

      strictEqual(api.sendUserTo("https://example.com/r"), baseApi, );

      ok(state.target, "redirect not set");
      deepStrictEqual(state.target.queryParams, {}, "query should be empty");
      strictEqual(state.target.url.href, "https://example.com/r", "url mismatch");
    });

    await t.test("redirect with consolidated GET parameters", async (t) => {
      const now = new Date();
      const request = mockRequest();
      const user = mockUser();
      const { build, state } = redirectMock("Another Flow", { now, request, user });
      const api = build(baseApi);

      strictEqual(
        api.sendUserTo("https://example.com?bread=rye", {
          query: { filling: "cheese", spread: "butter" },
        }),
        baseApi
      );

      ok(state.target, "redirect not set");

      deepStrictEqual(
        state.target.queryParams,
        { bread: "rye", filling: "cheese", spread: "butter" },
        "unexpected query"
      );

      strictEqual(
        state.target.url.href,
        "https://example.com/?bread=rye&filling=cheese&spread=butter",
        "url mismatch"
      );
    });
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
      user: mockUser({ user_id: TOKEN_PAYLOAD.sub }),
      request: mockRequest({
        method: "POST",
        body: {
          session_token: VALID_TOKEN,
          state: VALID_STATE,
        },
      }),
    } as const;

    await t.test("decodes a valid POST token", async (t) => {
      const { now, user } = VALID_CONTEXT;
      const request = mockRequest({
        method: "POST",
        body: {
          session_token: VALID_TOKEN,
          state: VALID_STATE,
        },
      });
      const { build, state } = redirectMock("Another Flow", { now, request, user });
      const api = build(baseApi);

      const payload = api.validateToken({ secret: VALID_SECRET });

      deepStrictEqual(payload, TOKEN_PAYLOAD, "unexpected payload");
    });

    await t.test("decodes a valid GET token", async (t) => {
      const { now, user } = VALID_CONTEXT;
      const request = mockRequest({
        method: "GET",
        query: {
          session_token: VALID_TOKEN,
          state: VALID_STATE,
        },
      });
      const { build, state } = redirectMock("Another Flow", { now, request, user });
      const api = build(baseApi);

      const payload = api.validateToken({ secret: VALID_SECRET });

      deepStrictEqual(payload, TOKEN_PAYLOAD, "unexpected payload");
    });

    await t.test("can use an alternative parameter", async (t) => {
      const { now, user } = VALID_CONTEXT;
      const request = mockRequest({
        method: "POST",
        body: {
          a_token_param: VALID_TOKEN,
          state: VALID_STATE,
        },
      });
      const { build, state } = redirectMock("Another Flow", { now, request, user });
      const api = build(baseApi);

      const payload = api.validateToken({
        secret: VALID_SECRET,
        tokenParameterName: "a_token_param",
      });

      deepStrictEqual(payload, TOKEN_PAYLOAD, "unexpected payload");
    });

    await t.test("throws error if state is mismatched", async (t) => {
      const context = structuredClone(VALID_CONTEXT);
      context.request.body.state = "mismatched-from-token-value";
      const { build, state } = redirectMock("Another Flow", context);
      const api = build(baseApi);

      throws(
        () => api.validateToken({ secret: VALID_SECRET }),
        /state in the token/i
      );
    });

    await t.test("throws error if param is missing", async (t) => {
      const { build, state } = redirectMock("Another Flow", VALID_CONTEXT);
      const api = build(baseApi);

      throws(
        () =>
          api.validateToken({
            secret: VALID_SECRET,
            tokenParameterName: "a_token_param",
          }),
        /no parameter called 'a_token_param'/i
      );
    });

    await t.test("throws error if expired", async (t) => {
      const { user, request } = VALID_CONTEXT;
      const now = TOKEN_PAYLOAD.exp * 1000; // exactly the expiry time
      const { build, state } = redirectMock("Another Flow", { ...VALID_CONTEXT, now });
      const api = build(baseApi);

      throws(
        () => api.validateToken({ secret: VALID_SECRET }),
        /expired/i
      );
    });

    await t.test("throws error if signature is invalid", async (t) => {
      const context = structuredClone(VALID_CONTEXT);
      context.request.body.session_token = VALID_TOKEN.replace(
        /\.[^.]+$/,
        ".badsignature"
      );
      const { build, state } = redirectMock("Another Flow", context);
      const api = build(baseApi);

      throws(
        () => api.validateToken({ secret: VALID_SECRET }),
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

        const { build, state } = redirectMock("Another Flow", context);
        const api = build(baseApi);

        throws(
          () => api.validateToken({ secret: VALID_SECRET }),
          /missing or invalid standard claims/i
        );
      });
    }
  });
});
