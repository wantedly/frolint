import type { AST, Rule } from "eslint";
import type { ObjectExpression, Property, VariableDeclarator } from "estree";
import { docsUrl, isNexusSchemaImported } from "./utils";

export const RULE_NAME = "nexus-enum-values-description";

export const RULE: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    fixable: "code",
    schema: [
      {
        enum: ["error", "warn", "off"],
      },
    ],
    docs: {
      url: docsUrl(RULE_NAME),
    },
  },
  create(context) {
    let isNexusUsed = false;
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
        } else return;
      },

      Property(node) {
        if (!isNexusUsed) return;
        if (node.type !== "Property") return;
        if (node.key.type !== "Identifier") return;
        if (node.key.name !== "members") return;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const parent: ObjectExpression = node.parent;
        if (!parent || parent.type !== "ObjectExpression") return;

        const nameProperty = parent.properties
          .filter((maybeProperty): maybeProperty is Property => maybeProperty.type === "Property")
          .find((property) => property.key.type === "Identifier" && property.key.name === "name");
        if (!nameProperty) return;
        if (nameProperty.value.type !== "Literal") return; // TODO: Consider the variable
        const enumName = nameProperty.value.value as string;

        if (node.value.type === "ArrayExpression") {
          const elements = node.value.elements;
          elements.forEach((elem) => {
            if (!elem) return;

            if (elem.type === "Literal") {
              if (!elem.value) return;

              return context.report({
                node: elem,
                message: "The enum member `{{enumName}}.{{value}}` should have a description",
                data: {
                  enumName,
                  value: elem.value as string,
                },
              });
            }

            if (elem.type === "ObjectExpression") {
              const properties = elem.properties;
              const nameProperty = properties
                .filter((maybeProperty): maybeProperty is Property => maybeProperty.type === "Property")
                .find((property) => property.key.type === "Identifier" && property.key.name === "name");
              if (!nameProperty) return;
              if (nameProperty.value.type !== "Literal") return; // TODO: Consider the variable

              const descriptionProperty = properties
                .filter((maybeProperty): maybeProperty is Property => maybeProperty.type === "Property")
                .find((property) => property.key.type === "Identifier" && property.key.name === "description");
              if (!descriptionProperty) {
                return context.report({
                  node: elem,
                  message: "The enum member `{{enumName}}.{{value}}` should have a description",
                  data: {
                    enumName,
                    value: nameProperty.value.value as string,
                  },
                });
              }

              if (descriptionProperty.value.type !== "Literal") return; // TODO: Consider the vairable

              const descriptionValue = descriptionProperty.value;
              if (
                descriptionValue &&
                typeof descriptionValue.value === "string" &&
                descriptionValue.value.trim().length === 0
              ) {
                return context.report({
                  node: elem,
                  message: "The enum member `{{enumName}}.{{value}}` should have a description",
                  data: {
                    enumName,
                    value: nameProperty.value.value as string,
                  },
                });
              }
            }
          });

          return;
        }

        if (node.value.type === "ObjectExpression") {
          return context.report({
            node: node.value,
            message:
              "The enum definition `{{enumName}}` cannot specify the description for each enum member. You should use array expression for members property instead",
            data: {
              enumName,
            },
          });
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
          if (!maybeToken) return;

          const tokenStartIndex = maybeToken.range?.[0] ?? 0;
          const maybeNode = sourceCode.getNodeByRangeIndex(tokenStartIndex);
          if (!maybeNode) return;

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const parent: VariableDeclarator = maybeNode.parent;
          if (!parent || parent.type !== "VariableDeclarator" || !parent.init) return;

          if (parent.init.type === "ArrayExpression") {
            /**
             * In this case, the variable is array
             * e.g. const members = ["foo", "bar"]
             */
            const elements = parent.init.elements;
            elements.forEach((elem) => {
              if (!elem) return;

              if (elem.type === "Literal") {
                if (!elem.value) return;

                return context.report({
                  node: elem,
                  message: "The enum member `{{enumName}}.{{value}}` should have a description",
                  data: {
                    enumName,
                    value: elem.value as string,
                  },
                });
              }

              if (elem.type === "ObjectExpression") {
                const properties = elem.properties;
                const nameProperty = properties
                  .filter((maybeProperty): maybeProperty is Property => maybeProperty.type === "Property")
                  .find((property) => property.key.type === "Identifier" && property.key.name === "name");
                if (!nameProperty || nameProperty.value.type !== "Literal") return;

                const descriptionProperty = properties
                  .filter((maybeProperty): maybeProperty is Property => maybeProperty.type === "Property")
                  .find((property) => property.key.type === "Identifier" && property.key.name === "description");
                if (!descriptionProperty) {
                  return context.report({
                    node: elem,
                    message: "The enum member `{{enumName}}.{{value}}` should have a description",
                    data: {
                      enumName,
                      value: nameProperty.value.value as string,
                    },
                  });
                }

                if (descriptionProperty.value.type !== "Literal") return; // TODO: Consider the variable

                const descriptionValue = descriptionProperty.value;
                if (
                  descriptionValue &&
                  typeof descriptionValue.value === "string" &&
                  descriptionValue.value.trim().length === 0
                ) {
                  return context.report({
                    node: elem,
                    message: "The enum member `{{enumName}}.{{value}}` should have a description",
                    data: {
                      enumName,
                      value: nameProperty.value.value as string,
                    },
                  });
                }
              }
            });

            return;
          } else if (parent.init.type === "ObjectExpression") {
            /**
             * In this case, the variable is object
             * e.g. const members = { foo: 1, bar: 2 }
             */
            return context.report({
              node: node.value,
              message:
                "The enum definition `{{enumName}}` cannot specify the description for each enum member. You should use array expression for members property instead",
              data: {
                enumName,
              },
            });
          }

          return;
        }
      },
    };
  },
};
