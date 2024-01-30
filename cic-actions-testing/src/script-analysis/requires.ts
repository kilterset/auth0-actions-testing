import * as ts from "typescript";

export function requires(node: ts.Node) {
  if (ts.isCallExpression(node)) {
    const expression = node.expression;

    if (ts.isIdentifier(expression) && expression.text === "require") {
      const firstArg = node.arguments[0];
      if (ts.isStringLiteral(firstArg)) {
        return firstArg.text;
      }
    }
  }
}
