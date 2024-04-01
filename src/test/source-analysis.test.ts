import test from "node:test";
import { deepStrictEqual } from "node:assert";
import path from "path";
import { analyseScript } from "../script-analysis/analyse";

test("source analysis", async (t) => {
  const analysis = await analyseScript(fixturePath("source-code-example.js"));

  deepStrictEqual(analysis, {
    requires: ["dependency-a", "dependency-b"],
    exports: ["onExecutePostUserRegistration"],
    secrets: ["DANGER_ZONE", "EJECTOR_SEAT"],
  });
});

const ROOT_DIR = path.resolve(__dirname, "../../");

function fixturePath(...filename: string[]) {
  return path.join(ROOT_DIR, "src", "test", "fixtures", ...filename);
}
