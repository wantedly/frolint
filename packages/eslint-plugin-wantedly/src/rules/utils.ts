import type { Node } from "estree";

export function getOptionWithDefault(context: any, defaultOption: any) {
  return context.options.reduce((acc: any, obj: any) => ({ ...acc, ...obj }), defaultOption);
}

export function docsUrl(ruleName: string) {
  return `https://github.com/wantedly/frolint/tree/master/packages/eslint-plugin-wantedly/docs/rules/${ruleName}.md`;
}

export function isNexusSchemaImported(node: Node) {
  return (
    node.type === "ImportDeclaration" &&
    node.source &&
    node.source.type === "Literal" &&
    node.source.value === "@nexus/schema"
  );
}
