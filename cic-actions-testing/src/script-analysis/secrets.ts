import * as ts from "typescript";

export function secrets(node: ts.Node) {
  if (ts.isPropertyAccessExpression(node)) {
    const object = node.expression;

    if (ts.isPropertyAccessExpression(object)) {
      const nestedObject = object.expression;
      const nestedProperty = object.name;

      if (
        ts.isIdentifier(nestedObject) &&
        nestedObject.text === "event" &&
        ts.isIdentifier(nestedProperty) &&
        nestedProperty.text === "secrets"
      ) {
        return node.name.text;
      }
    }
  }
}
