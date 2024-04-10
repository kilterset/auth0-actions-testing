import test from "node:test";
import { accessMock } from "../../mock/api/access";
import { ok, strictEqual } from "node:assert";

test("access mock", async (t) => {
  const baseApi = Symbol("Base API");

  await t.test("allowed", async (t) => {
    const { build, state } = accessMock("Another Flow");
    const api = build(baseApi);

    ok(!state.denied, "Expected access to be allowed");
  });

  await t.test("denied", async (t) => {
    const { build, state } = accessMock("Another Flow");
    const api = build(baseApi);

    strictEqual(api.deny("Must be an admin"), baseApi, "Expected base api to be returned");
    
    ok(state.denied, "Expected access to be denied");
    strictEqual(state.denied.reason, "Must be an admin", "Expected reason to be set");
  });

  await t.test("CredentialsExchange", async (t) => {
    await t.test("allowed", async (t) => {
      const { build, state } = accessMock("CredentialsExchange");
      const api = build(baseApi);

      ok(!state.denied, "Expected access to be allowed");
    });

    await t.test("denied", async (t) => {
      const { build, state } = accessMock("CredentialsExchange");
      const api = build(baseApi);

      strictEqual(api.deny("invalid_scope", "Must be an admin"), baseApi, "Expected base api to be returned");
      
      ok(state.denied, "Expected access to be denied");
      strictEqual(state.denied.code, "invalid_scope", "Expected code to be set");
      strictEqual(state.denied.reason, "Must be an admin", "Expected reason to be set");
    });
  });
});
