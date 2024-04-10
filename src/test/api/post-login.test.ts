import test from "node:test";
import { strictEqual, deepStrictEqual, throws, ok } from "node:assert";
import { postLogin } from "../../mock/api";
import { request, user } from "../../mock";
import { encodeHS256JWT } from "../../jwt/hs256";

test("PostLogin API", async (t) => {
  await t.test("access", async (t) => {
    const { implementation: api, state } = postLogin();

    strictEqual(api.access.deny("Only cool kids allowed"), api);

    ok(state.access.denied, "Expected access to be denied");
    strictEqual(state.access.denied.reason, "Only cool kids allowed");
  });

  await t.test("accessToken", async (t) => {
    await t.test("is chainable", async (t) => {
      const { implementation: api, state } = postLogin();
      strictEqual(api.accessToken.addScope("admin"), api);
      strictEqual(api.accessToken.setCustomClaim("favourite_pet", "cat"), api);
    });

    await t.test("can add and remove scopes", async (t) => {
      const { implementation: api, state } = postLogin();
      strictEqual(api.accessToken.addScope("admin"), api);
      api.accessToken.addScope("root");
      deepStrictEqual(state.accessToken.scopes, ["admin", "root"]);
      api.accessToken.removeScope("root");
      deepStrictEqual(state.accessToken.scopes, ["admin"]);
    });

    await t.test("ignores duplicate scopes", async (t) => {
      const { implementation: api, state } = postLogin();
      api.accessToken.addScope("duplicate");
      api.accessToken.addScope("duplicate");
      deepStrictEqual(state.accessToken.scopes, ["duplicate"]);
    });

    await t.test("can set custom claims", async (t) => {
      const { implementation: api, state } = postLogin();
      strictEqual(api.accessToken.setCustomClaim("favourite_pet", "cat"), api);
      deepStrictEqual(state.accessToken.claims, { favourite_pet: "cat" });
    });
  });

  await t.test("set app metadata", async (t) => {
    const { implementation: api, state } = postLogin();
    strictEqual(api.user.setAppMetadata("handle", "@pat"), api);
    deepStrictEqual(state.user.app_metadata, { handle: "@pat" });
  });

  await t.test("set user metadata", async (t) => {
    const { implementation: api, state } = postLogin();
    strictEqual(api.user.setUserMetadata("favourite_pet", "cat"), api);
    deepStrictEqual(state.user.user_metadata, { favourite_pet: "cat" });
  });

  await t.test("can set ID token claims", async (t) => {
    const { implementation: api, state } = postLogin();
    strictEqual(api.idToken.setCustomClaim("country", "NZ"), api);
    deepStrictEqual(state.idToken.claims, { country: "NZ" });
  });

  await t.test("enabling multifactor", async (t) => {
    const { implementation: api, state } = postLogin();
    strictEqual(state.multifactor.enabled, false);

    const options = {
      allowRememberBrowser: true,
      providerOptions: {
        host: "custom-host",
        ikey: "custom-ikey",
        skey: "custom-skey",
        username: "custom-username",
      },
    };

    strictEqual(api.multifactor.enable("duo", options), api);
    deepStrictEqual(state.multifactor.enabled, { provider: "duo", options });
  });

  await t.test("can check whether a rule was executed", async (t) => {
    const { implementation: api, state } = postLogin({
      executedRules: ["rule-42"],
    });

    strictEqual(api.rules.wasExecuted("rule-42"), true);
    strictEqual(api.rules.wasExecuted("some-not-executed-rule"), false);
  });

  await t.test("samlResponse customisation", async (t) => {
    const { implementation: api, state } = postLogin();

    await t.test("attributes", async (t) => {
      deepStrictEqual(state.samlResponse.attributes, {});
      api.samlResponse.setAttribute("species", "cat");
      api.samlResponse.setAttribute("nickname", "Buddy");
      deepStrictEqual(state.samlResponse.attributes, {
        species: "cat",
        nickname: "Buddy",
      });
    });

    await t.test("audience", async (t) => {
      strictEqual(state.samlResponse.audience, "default-audience");
      api.samlResponse.setAudience("custom-audience");
      strictEqual(state.samlResponse.audience, "custom-audience");
    });

    await t.test("recipient", async (t) => {
      strictEqual(state.samlResponse.recipient, "default-recipient");
      api.samlResponse.setRecipient("custom-recipient");
      strictEqual(state.samlResponse.recipient, "custom-recipient");
    });

    await t.test("destination", async (t) => {
      strictEqual(state.samlResponse.destination, "default-destination");
      api.samlResponse.setDestination("custom-destination");
      strictEqual(state.samlResponse.destination, "custom-destination");
    });

    await t.test("createUpnClaim", async (t) => {
      strictEqual(state.samlResponse.createUpnClaim, true);
      api.samlResponse.setCreateUpnClaim(false);
      strictEqual(state.samlResponse.createUpnClaim, false);
    });

    await t.test("passthroughClaimsWithNoMapping", async (t) => {
      strictEqual(state.samlResponse.passthroughClaimsWithNoMapping, true);
      api.samlResponse.setPassthroughClaimsWithNoMapping(false);
      strictEqual(state.samlResponse.passthroughClaimsWithNoMapping, false);
    });

    await t.test("mapUnknownClaimsAsIs", async (t) => {
      strictEqual(state.samlResponse.mapUnknownClaimsAsIs, false);
      api.samlResponse.setMapUnknownClaimsAsIs(true);
      strictEqual(state.samlResponse.mapUnknownClaimsAsIs, true);
    });

    await t.test("mapIdentities", async (t) => {
      strictEqual(state.samlResponse.mapIdentities, true);
      api.samlResponse.setMapIdentities(false);
      strictEqual(state.samlResponse.mapIdentities, false);
    });

    await t.test("signResponse", async (t) => {
      strictEqual(state.samlResponse.signResponse, false);
      api.samlResponse.setSignResponse(true);
      strictEqual(state.samlResponse.signResponse, true);
    });

    await t.test("includeAttributeNameFormat", async (t) => {
      strictEqual(state.samlResponse.includeAttributeNameFormat, true);
      api.samlResponse.setIncludeAttributeNameFormat(false);
      strictEqual(state.samlResponse.includeAttributeNameFormat, false);
    });

    await t.test("typedAttributes", async (t) => {
      strictEqual(state.samlResponse.typedAttributes, true);
      api.samlResponse.setTypedAttributes(false);
      strictEqual(state.samlResponse.typedAttributes, false);
    });

    await t.test("lifetimeInSeconds", async (t) => {
      strictEqual(state.samlResponse.lifetimeInSeconds, 3600);
      api.samlResponse.setLifetimeInSeconds(42);
      strictEqual(state.samlResponse.lifetimeInSeconds, 42);
    });

    await t.test("nameIdentifierFormat", async (t) => {
      const { implementation: api, state } = postLogin();

      strictEqual(
        state.samlResponse.nameIdentifierFormat,
        "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"
      );

      api.samlResponse.setNameIdentifierFormat("custom-format");
      strictEqual(state.samlResponse.nameIdentifierFormat, "custom-format");
    });

    await t.test("nameIdentifierProbes", async (t) => {
      const { implementation: api, state } = postLogin();

      deepStrictEqual(state.samlResponse.nameIdentifierProbes, [
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
      ]);

      api.samlResponse.setNameIdentifierProbes([
        "custom-probe-a",
        "custom-probe-b",
      ]);

      deepStrictEqual(state.samlResponse.nameIdentifierProbes, [
        "custom-probe-a",
        "custom-probe-b",
      ]);
    });

    await t.test("authnContextClassRef", async (t) => {
      const { implementation: api, state } = postLogin();

      strictEqual(
        state.samlResponse.authnContextClassRef,
        "urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified"
      );

      api.samlResponse.setAuthnContextClassRef(
        "custom-authn-context-class-ref"
      );

      strictEqual(
        state.samlResponse.authnContextClassRef,
        "custom-authn-context-class-ref"
      );
    });
  });

  await t.test("authentication", async (t) => {
    await t.test("challenge", async (t) => {
      await t.test("is false by default", async (t) => {
        const { implementation: api, state } = postLogin();
        strictEqual(state.authentication.challenge, false);
      });

      await t.test("can be set with a default", async (t) => {
        const { implementation: api, state } = postLogin();

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
        const { implementation: api, state } = postLogin();

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
        const { implementation: api, state } = postLogin();

        const factors = [{ type: "email" }, { type: "webauthn-roaming" }];

        strictEqual(api.authentication.challengeWithAny(factors), undefined);

        deepStrictEqual(state.authentication.challenge, {
          default: undefined,
          allOptions: factors,
        });
      });
    });

    await t.test("enroll", async (t) => {
      await t.test("is false by default", async (t) => {
        const { implementation: api, state } = postLogin();
        strictEqual(state.authentication.enrollment, false);
      });

      await t.test("can be set with a default", async (t) => {
        const { implementation: api, state } = postLogin();

        strictEqual(api.authentication.enrollWith({ type: "otp" }), undefined);

        deepStrictEqual(state.authentication.enrollment, {
          default: { type: "otp" },
          allOptions: [{ type: "otp" }],
        });
      });

      await t.test("can be set with a default and alternatives", async (t) => {
        const { implementation: api, state } = postLogin();

        strictEqual(
          api.authentication.enrollWith(
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

        deepStrictEqual(state.authentication.enrollment, {
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
        const { implementation: api, state } = postLogin();

        const factors = [{ type: "email" }, { type: "webauthn-roaming" }];

        strictEqual(api.authentication.enrollWithAny(factors), undefined);

        deepStrictEqual(state.authentication.enrollment, {
          default: undefined,
          allOptions: factors,
        });
      });
    });

    await t.test(
      "recordMethod adds to the list of newly recorded methods",
      async (t) => {
        const { implementation: api, state } = postLogin();

        strictEqual(api.authentication.recordMethod("https://method-1"), api);

        deepStrictEqual(state.authentication.newlyRecordedMethods, [
          "https://method-1",
        ]);

        api.authentication.recordMethod("https://method-2");

        deepStrictEqual(state.authentication.newlyRecordedMethods, [
          "https://method-1",
          "https://method-2",
        ]);
      }
    );

    await t.test("setPrimaryUser", async (t) => {
      await t.test("can change the primary user ID", async (t) => {
        const { implementation: api, state } = postLogin();
        const originalUserId = state.user.user_id;
        strictEqual(state.primaryUserId, originalUserId);

        strictEqual(
          api.authentication.setPrimaryUser("new-primary-user-id"),
          undefined
        );

        strictEqual(state.primaryUserId, "new-primary-user-id");
        strictEqual(state.user.user_id, originalUserId);
      });

      await t.test("can only be called once per transaction", async (t) => {
        const { implementation: api, state } = postLogin();
        api.authentication.setPrimaryUser("new-primary-user-id");

        throws(
          () => api.authentication.setPrimaryUser("new-primary-user-id"),
          /once/
        );
      });
    });
  });

  await t.test("validation error", async (t) => {
    const { implementation: api, state } = postLogin();

    strictEqual(state.validation.error, null);

    strictEqual(api.validation.error("E_KABOOM", "Something went wrong"), api);

    deepStrictEqual(state.validation.error, {
      code: "E_KABOOM",
      message: "Something went wrong",
    });
  });

  await t.test("redirect", async (t) => {
    await t.test("sendUserTo", async (t) => {
      await t.test("simple redirect", async (t) => {
        const { implementation: api, state } = postLogin();

        strictEqual(api.redirect.sendUserTo("https://example.com/r"), api);

        const { redirect } = state;

        ok(redirect, "redirect not set");
        deepStrictEqual(redirect.queryParams, {}, "query should be empty");
        strictEqual(redirect.url.href, "https://example.com/r", "url mismatch");
      });

      await t.test("redirect with consolidated GET parameters", async (t) => {
        const { implementation: api, state } = postLogin();

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

      const { implementation: api } = postLogin({
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

        const { implementation: api } = postLogin({
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

        const { implementation: api } = postLogin({
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

        const { implementation: api } = postLogin({
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

        const { implementation: api } = postLogin(context);

        throws(
          () => api.redirect.validateToken({ secret: VALID_SECRET }),
          /state in the token/i
        );
      });

      await t.test("throws error if param is missing", async (t) => {
        const { implementation: api } = postLogin(VALID_CONTEXT);

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

        const { implementation: api } = postLogin({
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

        const { implementation: api } = postLogin(context);

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

          const { implementation: api } = postLogin(context);

          throws(
            () => api.redirect.validateToken({ secret: VALID_SECRET }),
            /missing or invalid standard claims/i
          );
        });
      }
    });
  });
});
