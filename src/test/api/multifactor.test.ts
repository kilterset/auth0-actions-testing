import { deepStrictEqual, ok, strictEqual } from "node:assert";
import test from "node:test";
import { multifactorMock } from "../../mock/api/multifactor";

test("multifactor", async (t) => {
  const baseApi = Symbol("Base API");

  await t.test("enable", async (t) => {
    const { build, state } = multifactorMock("Another Flow");
    const api = build(baseApi);

    strictEqual(state.enabled, false);

    const options = {
      allowRememberBrowser: true,
      providerOptions: {
        host: "custom-host",
        ikey: "custom-ikey",
        skey: "custom-skey",
        username: "custom-username",
      },
    };

    strictEqual(api.enable("duo", options), baseApi, "Expected base api to be returned");

    ok(state.enabled, "Expected multifactor to be enabled");
    deepStrictEqual(state.enabled, { provider: "duo", options });
  });
});
