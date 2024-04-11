import test from "node:test";
import { userMock } from "../../mock/api/user";
import { deepStrictEqual, strictEqual } from "node:assert";
import { user } from "../../mock";

test("user", async (t) => {
  const baseApi = Symbol("Base API");

  await t.test('setAppMetadata', (t) => {
    const { build, state } = userMock("Another Flow", { user: user() });
    const api = build(baseApi);

    strictEqual(api.setAppMetadata("name", "Alice"), baseApi, "Expected base api to be returned");

    deepStrictEqual(state.app_metadata, { name: "Alice" }, "Expected app metadata to be set");
  });

  await t.test('setUserMetadata', (t) => {
    const { build, state } = userMock("Another Flow", { user: user() });
    const api = build(baseApi);

    strictEqual(api.setUserMetadata("name", "Alice"), baseApi, "Expected base api to be returned");

    deepStrictEqual(state.user_metadata, { name: "Alice" }, "Expected user metadata to be set");
  });
});
