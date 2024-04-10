import test from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";
import { preUserRegistration } from "../../mock/api";

test("Pre User Registration API", async (t) => {
  await t.test("access", async (t) => {
    const { implementation: api, state } = preUserRegistration();

    strictEqual(api.access.deny("go_away", "Only cool kids allowed"), api);

    deepStrictEqual(state.access.denied, {
      code: "go_away",
      reason: "Only cool kids allowed",
    });
  });

  await t.test("set app metadata", async (t) => {
    const { implementation: api, state } = preUserRegistration();
    strictEqual(api.user.setAppMetadata("handle", "@pat"), api);
    deepStrictEqual(state.user.app_metadata, { handle: "@pat" });
  });

  await t.test("set user metadata", async (t) => {
    const { implementation: api, state } = preUserRegistration();
    strictEqual(api.user.setUserMetadata("favourite_pet", "cat"), api);
    deepStrictEqual(state.user.user_metadata, { favourite_pet: "cat" });
  });

  await t.test("cache", async (t) => {
    await t.test("can set cache", async (t) => {
      const { implementation: api, state } = preUserRegistration();
      strictEqual(api.cache.set("location", "Ōtautahi").type, "success");
      deepStrictEqual(state.cache.get("location"), "Ōtautahi");
    });

    await t.test("can get cache", async (t) => {
      const { implementation: api, state } = preUserRegistration({
        cache: { location: "Ōtautahi" },
      });

      strictEqual(state.cache.get("location"), "Ōtautahi");
      strictEqual(state.cache.get("nonexistent"), undefined);
    });
  });
});
