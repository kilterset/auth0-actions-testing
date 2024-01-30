import fs from "fs/promises";
import * as ts from "typescript";
import { SCANNERS } from "./";

export async function analyseScript(
  path: string,
  { target = ts.ScriptTarget.ES2016 } = {}
) {
  const sourceString = (await fs.readFile(path)).toString();

  const sourceFile = ts.createSourceFile(path, sourceString, target);

  const results: Record<keyof typeof SCANNERS, string[]> = Object.keys(
    SCANNERS
  ).reduce((collection, name) => {
    collection[name as keyof typeof SCANNERS] = [];
    return collection;
  }, {} as Record<keyof typeof SCANNERS, string[]>);

  const analysis = Object.entries(SCANNERS);

  visit(sourceFile);

  function visit(node: ts.Node) {
    for (const [key, visit] of analysis) {
      const result = visit(node);

      if (result) {
        results[key as keyof typeof SCANNERS].push(result);
      }
    }

    ts.forEachChild(node, visit);
  }

  return results;
}
