import test from "node:test";
import { riskAssessment } from "../../mock";
import { deepStrictEqual, ok, strictEqual, throws } from "node:assert";

test("riskAssessment mock", async (t) => {
  await t.test("has sensible defaults", () => {
    const { confidence, version, assessments } = riskAssessment();
    ok(confidence, "confidence missing");
    ok(version, "version missing");
    ok(Object.keys(assessments).length, "assessments missing");
  });

  await t.test("can use numAssessments", () => {
    const { assessments } = riskAssessment({}, { numAssessments: 3 });

    strictEqual(
      Object.keys(assessments).length,
      3,
      "wrong number of assessments"
    );
  });

  await t.test(
    "throws an error if numAssessments is greater than available",
    () => {
      throws(
        () => riskAssessment({}, { numAssessments: 100 }),
        /greater than the \d+ assessment types available/
      );
    }
  );

  await t.test("can use assessmentTypes", () => {
    const { assessments } = riskAssessment(
      {},
      { assessmentTypes: ["ImpossibleTravel", "NewDevice"] }
    );

    deepStrictEqual(
      Object.keys(assessments),
      ["ImpossibleTravel", "NewDevice"],
      "unexpected assessment types"
    );
  });
});
