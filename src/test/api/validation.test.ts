import test from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";
import { validationMock } from "../../mock/api/validation";

test("Validation", async (t) => {
  await t.test("error", async (t) => {
    const baseApi = Symbol("Base API");
    const { state, build } = validationMock("Another Flow");
    const api = build(baseApi);

    strictEqual(state.error, null);

    strictEqual(api.error("E_KABOOM", "Something went wrong"), baseApi);

    deepStrictEqual(state.error, {
      code: "E_KABOOM",
      message: "Something went wrong",
    });
  });
});
