import test from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";
import { postLogin } from "../../mock/api";

test("PostLogin API", async (t) => {
  await t.test("access", async (t) => {
    const { implementation: api, state } = postLogin();

    strictEqual(api.access.deny("Only cool kids allowed"), api);

    deepStrictEqual(state.access, {
      denied: true,
      reason: "Only cool kids allowed",
    });
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
});
