import test from "node:test";
import { authentication } from "../../mock";
import { fail, ok, strictEqual, throws } from "node:assert";

test("authentication mock", async (t) => {
  await t.test("has sensible defaults", () => {
    const { methods, riskAssessment } = authentication();
    const firstMethod = methods[0];
    ok(firstMethod, "methods is empty");
    ok(firstMethod.name, "method name is empty");
    ok(riskAssessment, "riskAssessment is missing");

    try {
      new Date(firstMethod.timestamp);
    } catch {
      fail("timestamp is not a date");
    }
  });

  await t.test("can have a number of methods", () => {
    const { methods } = authentication({}, { numMethods: 3 });
    strictEqual(methods.length, 3, "wrong number of methods");
  });

  await t.test("can have zero methods", () => {
    const { methods } = authentication({}, { numMethods: 0 });
    strictEqual(methods.length, 0, "expected no methods");
  });

  await t.test("raises an error if both methods and numMethods are set", () => {
    throws(
      () => authentication({ methods: [] }, { numMethods: 1 }),
      /specify only one/i
    );
  });
});
