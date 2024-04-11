import test from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";
import { sendPhoneMessage } from "../../mock/api";

test("Post User Registration API", async (t) => {
  await t.test("cache", async (t) => {
    await t.test("can set cache", async (t) => {
      const { implementation: api, state } = sendPhoneMessage();
      strictEqual(api.cache.set("location", "Ōtautahi").type, "success");
      deepStrictEqual(state.cache.get("location"), "Ōtautahi");
    });

    await t.test("can get cache", async (t) => {
      const { state } = sendPhoneMessage({ cache: { location: "Ōtautahi" } });
      strictEqual(state.cache.get("location"), "Ōtautahi");
      strictEqual(state.cache.get("nonexistent"), undefined);
    });
  });
});
