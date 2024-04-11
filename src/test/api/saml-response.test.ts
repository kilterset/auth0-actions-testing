import test from "node:test";
import { strictEqual, deepStrictEqual, throws, ok } from "node:assert";
import { samlResponseMock } from "../../mock/api/saml-response";

test("Saml Response", async (t) => {
  const baseApi = Symbol("Base API");
  const { build, state } = samlResponseMock("Another Flow");
  const api = build(baseApi);

  await t.test("attributes", async (t) => {
    deepStrictEqual(state.attributes, {});
    api.setAttribute("species", "cat");
    api.setAttribute("nickname", "Buddy");
    deepStrictEqual(state.attributes, {
      species: "cat",
      nickname: "Buddy",
    });
  });

  await t.test("audience", async (t) => {
    strictEqual(state.audience, "default-audience");
    api.setAudience("custom-audience");
    strictEqual(state.audience, "custom-audience");
  });

  await t.test("recipient", async (t) => {
    strictEqual(state.recipient, "default-recipient");
    api.setRecipient("custom-recipient");
    strictEqual(state.recipient, "custom-recipient");
  });

  await t.test("destination", async (t) => {
    strictEqual(state.destination, "default-destination");
    api.setDestination("custom-destination");
    strictEqual(state.destination, "custom-destination");
  });

  await t.test("createUpnClaim", async (t) => {
    strictEqual(state.createUpnClaim, true);
    api.setCreateUpnClaim(false);
    strictEqual(state.createUpnClaim, false);
  });

  await t.test("passthroughClaimsWithNoMapping", async (t) => {
    strictEqual(state.passthroughClaimsWithNoMapping, true);
    api.setPassthroughClaimsWithNoMapping(false);
    strictEqual(state.passthroughClaimsWithNoMapping, false);
  });

  await t.test("mapUnknownClaimsAsIs", async (t) => {
    strictEqual(state.mapUnknownClaimsAsIs, false);
    api.setMapUnknownClaimsAsIs(true);
    strictEqual(state.mapUnknownClaimsAsIs, true);
  });

  await t.test("mapIdentities", async (t) => {
    strictEqual(state.mapIdentities, true);
    api.setMapIdentities(false);
    strictEqual(state.mapIdentities, false);
  });

  await t.test("signResponse", async (t) => {
    strictEqual(state.signResponse, false);
    api.setSignResponse(true);
    strictEqual(state.signResponse, true);
  });

  await t.test("includeAttributeNameFormat", async (t) => {
    strictEqual(state.includeAttributeNameFormat, true);
    api.setIncludeAttributeNameFormat(false);
    strictEqual(state.includeAttributeNameFormat, false);
  });

  await t.test("typedAttributes", async (t) => {
    strictEqual(state.typedAttributes, true);
    api.setTypedAttributes(false);
    strictEqual(state.typedAttributes, false);
  });

  await t.test("lifetimeInSeconds", async (t) => {
    strictEqual(state.lifetimeInSeconds, 3600);
    api.setLifetimeInSeconds(42);
    strictEqual(state.lifetimeInSeconds, 42);
  });

  await t.test("nameIdentifierFormat", async (t) => {
    const { build, state } = samlResponseMock("Another Flow");
    const api = build(baseApi);

    strictEqual(
      state.nameIdentifierFormat,
      "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"
    );

    api.setNameIdentifierFormat("custom-format");
    strictEqual(state.nameIdentifierFormat, "custom-format");
  });

  await t.test("nameIdentifierProbes", async (t) => {
    const { build, state } = samlResponseMock("Another Flow");
    const api = build(baseApi);

    deepStrictEqual(state.nameIdentifierProbes, [
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
    ]);

    api.setNameIdentifierProbes([
      "custom-probe-a",
      "custom-probe-b",
    ]);

    deepStrictEqual(state.nameIdentifierProbes, [
      "custom-probe-a",
      "custom-probe-b",
    ]);
  });

  await t.test("authnContextClassRef", async (t) => {
    const { build, state } = samlResponseMock("Another Flow");
    const api = build(baseApi);

    strictEqual(
      state.authnContextClassRef,
      "urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified"
    );

    api.setAuthnContextClassRef(
      "custom-authn-context-class-ref"
    );

    strictEqual(
      state.authnContextClassRef,
      "custom-authn-context-class-ref"
    );
  });
});
