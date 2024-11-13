import { deepStrictEqual, ok, strictEqual } from "node:assert";
import test from "node:test";
import { promptMock } from "../../mock/api/prompt";

test("prompt", async (t) => {
  const baseApi = Symbol("Base API");

  await t.test("render", async (t) => {
    const { build, state } = promptMock("Another Flow");
    const api = build(baseApi);

    strictEqual(state.rendered, null);

    api.render("prompt-id", { fields: { foo: "bar" } });

    ok(Boolean(state.rendered), "Expected prompt to be rendered");

    deepStrictEqual(state.rendered, {
      promptId: "prompt-id",
      promptOptions: { fields: { foo: "bar" } },
    });
  });
});
