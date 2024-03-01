import test from "node:test";
import { deepStrictEqual, match, ok, strictEqual } from "node:assert";
import { organization } from "../../mock";

test("organization mock", async (t) => {
  await t.test("has sensible defaults", async () => {
    const { display_name, id, metadata, name } = organization();

    ok(typeof display_name === "string" && display_name, "no display_name");
    ok(typeof id === "string" && id, "no id");
    deepStrictEqual(metadata, {}, "expected empty metadata");
    ok(typeof name === "string" && name, "no name");
  });

  await t.test("can have any value overridden", async () => {
    const { display_name, id, metadata, name, extraProperty } = organization({
      display_name: "Consolidated Sandwiches, Inc.",
      id: "org_1234567890",
      metadata: {
        foo: "bar",
      },
      name: "sandwich-inc",
      extraProperty: "present",
    });

    strictEqual(
      display_name,
      "Consolidated Sandwiches, Inc.",
      "display_name not overridden"
    );

    match(id, /^org_[a-z0-9]+$/, "unexpected ID format");
    deepStrictEqual(metadata, { foo: "bar" }, "metadata not overridden");
    strictEqual(name, "sandwich-inc", "name not overridden");
    strictEqual(extraProperty, "present", "exta property not set");
  });

  await t.test("name derives from display_name", async () => {
    const { name } = organization({
      display_name: "Consolidated Sandwiches, Inc.",
    });

    strictEqual(name, "consolidated-sandwiches-inc");
  });
});
