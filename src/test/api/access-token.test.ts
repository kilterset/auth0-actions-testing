import test from "node:test";
import { accessTokenMock } from "../../mock/api/access-token";
import { deepStrictEqual, ok, strictEqual } from "node:assert";

test("access token", async (t) => {
  const baseApi = Symbol("baseApi");

  await t.test("default state", () => {
    const { state } = accessTokenMock("Another Flow");

    deepStrictEqual(state, {
      scopes: [],
      claims: {},
    });
  });

  await t.test("add scope", () => {
    const { state, build } = accessTokenMock("Another Flow");
    const api = build(baseApi);

    strictEqual(api.addScope("read:users"), baseApi, "Expected base api to be returned");

    ok(state.scopes.includes("read:users"), "Expected scope to be added");
  });

  await t.test("remove scope", () => {
    const { state, build } = accessTokenMock("Another Flow");
    const api = build(baseApi);

    api.addScope("read:users");

    strictEqual(api.removeScope("read:users"), baseApi, "Expected base api to be returned");

    ok(!state.scopes.includes("read:users"), "Expected scope to be removed");
  });

  await t.test("set custom claim", () => {
    const { state, build } = accessTokenMock("Another Flow");
    const api = build(baseApi);

    strictEqual(api.setCustomClaim("name", "Alice"), baseApi, "Expected base api to be returned");

    deepStrictEqual(state.claims, { name: "Alice" }, "Expected custom claim to be set");
  });

  await t.test("CredentialsExchange", async (t) => {
    await t.test("default state", async (t) => {
      const { state } = accessTokenMock("CredentialsExchange");

      deepStrictEqual(state, {
        claims: {},
      });
    });

    await t.test("set custom claim", async (t) => {
      const { state, build } = accessTokenMock("CredentialsExchange");
      const api = build(baseApi);

      strictEqual(api.setCustomClaim("name", "Alice"), baseApi, "Expected base api to be returned");

      deepStrictEqual(state.claims, { name: "Alice" }, "Expected custom claim to be set");
    });
  });
});
