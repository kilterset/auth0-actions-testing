import test from "node:test";
import { idTokenMock } from "../../mock/api/id-token";
import { deepStrictEqual, strictEqual } from "node:assert";

test('idToken', async (t) => {
  const baseApi = Symbol("baseApi")
  await t.test('setCustomClaim', () => {
    const { build, state } = idTokenMock("Another Flow");
    const api = build(baseApi);

    strictEqual(api.setCustomClaim("name", "Alice"), baseApi, "Expected base api to be returned");

    deepStrictEqual(state.claims.name, "Alice", "Expected custom claim to be set");
  })
});
