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
});
