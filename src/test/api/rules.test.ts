import test from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";
import { rulesMock } from "../../mock/api/rules";

test("Rules", async (t) => {
  await t.test("wasExecuted", async (t) => {
    const baseApi = Symbol("Base API");
    const { build } = rulesMock("Another Flow", { executedRules: ["rule-42"] });
    const api = build(baseApi);

    strictEqual(api.wasExecuted("rule-42"), true);
    strictEqual(api.wasExecuted("some-not-executed-rule"), false);
  });
});
