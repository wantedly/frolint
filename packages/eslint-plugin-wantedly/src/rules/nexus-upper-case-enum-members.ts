import type { AST, Rule } from "eslint";
import type { Node, ObjectExpression, Property } from "estree";
import { snakeCase } from "snake-case";

import { docsUrl, getOptionWithDefault, isNexusSchemaImported } from "./utils";

export const RULE_NAME = "nexus-upper-case-enum-members";

// Represents the default option and schema for nexus-upper-case-enum-members option
const DEFAULT_OPTION = {
  autofix: false,
};

export const RULE: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          autofix: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
    docs: {
      url: docsUrl(RULE_NAME),
    },
  },
  create(context) {
    let isNexusUsed = false;
    const option = getOptionWithDefault(context, DEFAULT_OPTION);
    const autofixEnabled = option.autofix;
    let allIdentifierTokens: AST.Token[] = [];

    return {
      Program(node) {
        allIdentifierTokens = context
          .getSourceCode()
          .getTokens(node)
          .filter((token) => token.type === "Identifier");
      },

      ImportDeclaration(importDeclaration) {
        if (isNexusSchemaImported(importDeclaration)) {
          isNexusUsed = true;
        } else {
          return;
        }
      },

      Property(node) {
        if (!isNexusUsed) {
          return;
        }

        if (node.type !== "Property") {
          return;
        }

        if (node.key.type !== "Identifier") {
          return;
        }

        if (node.key.name !== "members") {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const parent: ObjectExpression = node.parent;

        if (!parent) {
          return;
        }

        const nameProperty = parent.properties.find(
          (property): property is Property =>
            property.type === "Property" && property.key.type === "Identifier" && property.key.name === "name"
        );
        if (!nameProperty || nameProperty.value.type !== "Literal" || typeof nameProperty.value.value !== "string") {
          return;
        }
        const enumName = nameProperty.value.value;

        if (node.value.type === "ArrayExpression") {
          const elements = node.value.elements;
          elements.forEach((elem) => {
            if (!elem) return;

            if (elem.type === "Literal" && typeof elem.value === "string") {
              const value = elem.value || "";
              const upperCased = snakeCase(value).toUpperCase();

              if (value === upperCased) {
                return;
              }

              return context.report({
                node: elem,
                message: "The enum member `{{enumName}}.{{value}}` should be UPPER_CASE",
                data: {
                  value,
                  enumName,
                },
                fix(fixer) {
                  if (autofixEnabled) {
                    const [start, end] = elem.range || [0, 0];
                    return fixer.replaceTextRange([start + 1, end - 1], upperCased);
                  }
                  return null;
                },
              });
            }

            if (elem.type === "ObjectExpression") {
              const properties = elem.properties;
              const nameProperty = properties.find(
                (property): property is Property =>
                  property.type === "Property" && property.key.type === "Identifier" && property.key.name === "name"
              );
              if (
                !nameProperty ||
                nameProperty.value.type !== "Literal" ||
                typeof nameProperty.value.value !== "string"
              ) {
                return;
              }

              const value = nameProperty.value.value || "";
              const upperCased = snakeCase(value).toUpperCase();

              if (value === upperCased) {
                return;
              }

              return context.report({
                node: nameProperty.value,
                message: "The enum member `{{enumName}}.{{value}}` should be UPPER_CASE",
                data: {
                  value,
                  enumName,
                },
                fix(fixer) {
                  if (autofixEnabled) {
                    const [start, end] = nameProperty.value.range || [0, 0];
                    return fixer.replaceTextRange([start + 1, end - 1], upperCased);
                  }
                  return null;
                },
              });
            }
          });

          return;
        }

        if (node.value.type === "ObjectExpression") {
          const properties = node.value.properties;
          properties.forEach((property) => {
            if (property.type !== "Property" || property.key.type !== "Identifier") {
              return;
            }

            const keyName = property.key.name || "";
            const upperCased = snakeCase(keyName).toUpperCase();

            if (keyName === upperCased) {
              return;
            }

            return context.report({
              node: property.key,
              message:
                typeof enumName === "string"
                  ? "The enum member `{{enumName}}.{{keyName}}` should be UPPER_CASE"
                  : "The enum member `{{keyName}}` should be UPPER_CASE",
              data: {
                keyName,
                enumName,
              },
              fix(fixer) {
                if (autofixEnabled) {
                  const [start, end] = property.key.range || [0, 0];
                  return fixer.replaceTextRange([start, end], upperCased);
                }
                return null;
              },
            });
          });

          return;
        }

        if (node.value.type === "Identifier") {
          const membersVariableName = node.value.name;
          const sourceCode = context.getSourceCode();
          if (!Array.isArray(allIdentifierTokens)) {
            return;
          }

          const maybeToken = allIdentifierTokens.find(
            (token) => token.type === "Identifier" && token.value === membersVariableName
          );
          if (!maybeToken) {
            return;
          }

          const tokenStartIndex = maybeToken.range[0];
          const maybeNode = sourceCode.getNodeByRangeIndex(tokenStartIndex);
          if (!maybeNode) {
            return;
          }

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const parent: Node = maybeNode.parent;
          if (!parent || parent.type !== "VariableDeclarator" || !parent.init) {
            return;
          }

          if (parent.init.type === "ArrayExpression") {
            /**
             * In this case, the variable is array
             * e.g. const members = ["foo", "bar"]
             */
            const elements = parent.init.elements;
            elements.forEach((elem) => {
              if (!elem) return;

              if (elem.type !== "Literal" || typeof elem.value !== "string") {
                return;
              }

              const value = elem.value || "";
              const upperCased = snakeCase(value).toUpperCase();

              if (value === upperCased) {
                return;
              }

              return context.report({
                node: elem,
                message:
                  typeof enumName === "string"
                    ? "The enum member `{{enumName}}.{{value}}` should be UPPER_CASE"
                    : "The enum member `{{value}}` should be UPPER_CASE",
                data: {
                  value,
                  enumName,
                },
                // In this situation, we should not fix the issue automatically.
                // We cannot know the variable is used or not in other file.
                // fix(fixer) {},
              });
            });
          } else if (parent.init.type === "ObjectExpression") {
            /**
             * In this case, the variable is object
             * e.g. const members = { foo: 1, bar: 2 }
             */
            const properties = parent.init.properties;
            properties.forEach((property) => {
              if (property.type !== "Property" || property.key.type !== "Identifier") {
                return;
              }

              const keyName = property.key.name || "";
              const upperCased = snakeCase(keyName).toUpperCase();

              if (keyName === upperCased) {
                return;
              }

              return context.report({
                node: property,
                message:
                  typeof enumName === "string"
                    ? "The enum member `{{enumName}}.{{keyName}}` should be UPPER_CASE"
                    : "The enum member `{{keyName}}` should be UPPER_CASE",
                data: {
                  keyName,
                  enumName,
                },
                // In this situation, we should not fix the issue automatically.
                // We cannot know the variable is used or not in other file.
                // fix(fixer) {},
              });
            });
          }

          return;
        }
      },
    };
  },
};
