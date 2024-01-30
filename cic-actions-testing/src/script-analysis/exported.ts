import * as ts from "typescript";

export function exported(node: ts.Node) {
  if (ts.isPropertyAccessExpression(node)) {
    const object = node.expression;
    const propertyName = node.name;

    if (
      ts.isIdentifier(object) &&
      object.text === "exports" &&
      ts.isIdentifier(propertyName)
    ) {
      return propertyName.text;
    }
  }
}
