const { Linter } = require("eslint");
const { docsUrl } = require("./utils");

const linter = new Linter();
const RULE_NAME = "nexus-enum-values-description";

linter.defineRule(RULE_NAME, {
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      url: docsUrl(RULE_NAME),
    },
  },
  create(context) {
    let isNexusUsed = false;

    return {
      ImportDeclaration(importDeclaration) {
        if (
          importDeclaration.source &&
          importDeclaration.source.type === "Literal" &&
          importDeclaration.source.value === "nexus"
        ) {
          isNexusUsed = true;
        } else {
          return;
        }
      },

      Property(node) {
        if (!isNexusUsed) {
          return;
        }

        if (node.key.name !== "members") {
          return;
        }

        if (!node.parent) {
          return;
        }

        const nameProperty = node.parent.properties.find((property) => property.key.name === "name");
        if (!nameProperty) {
          return;
        }
        const enumName = nameProperty.value.value;

        if (node.value.type === "ArrayExpression") {
          const elements = node.value.elements;
          elements.forEach((elem) => {
            if (elem.type === "Literal") {
              if (!elem.value) {
                return;
              }

              return context.report({
                node: elem,
                message: "The enum member `{{enumName}}.{{value}}` should have a description",
                data: {
                  enumName,
                  value: elem.value,
                },
              });
            }

            if (elem.type === "ObjectExpression") {
              const properties = elem.properties;
              const nameProperty = properties.find((property) => property.key.name === "name");
              if (!nameProperty) {
                return;
              }

              const descriptionProperty = properties.find((property) => property.key.name === "description");
              if (!descriptionProperty) {
                return context.report({
                  node: elem,
                  message: "The enum member `{{enumName}}.{{value}}` should have a description",
                  data: {
                    enumName,
                    value: nameProperty.value.value,
                  },
                });
              }

              if (descriptionProperty.value.type !== "Literal") {
                // We now support only string literal for description property
                return;
              }

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
                    value: nameProperty.value.value,
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
          const tokensAndComments = sourceCode.tokensAndComments;
          if (!Array.isArray(tokensAndComments)) {
            return;
          }

          const maybeToken = tokensAndComments.find(
            (token) => token.type === "Identifier" && token.value === membersVariableName
          );
          if (!maybeToken) {
            return;
          }

          const tokenStartIndex = maybeToken.start || maybeToken.range[0];
          const maybeNode = sourceCode.getNodeByRangeIndex(tokenStartIndex);
          if (!maybeNode) {
            return;
          }

          const parent = maybeNode.parent;
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
              if (elem.type === "Literal") {
                if (!elem.value) {
                  return;
                }

                return context.report({
                  node: elem,
                  message: "The enum member `{{enumName}}.{{value}}` should have a description",
                  data: {
                    enumName,
                    value: elem.value,
                  },
                });
              }

              if (elem.type === "ObjectExpression") {
                const properties = elem.properties;
                const nameProperty = properties.find((property) => property.key.name === "name");
                if (!nameProperty) {
                  return;
                }

                const descriptionProperty = properties.find((property) => property.key.name === "description");
                if (!descriptionProperty) {
                  return context.report({
                    node: elem,
                    message: "The enum member `{{enumName}}.{{value}}` should have a description",
                    data: {
                      enumName,
                      value: nameProperty.value.value,
                    },
                  });
                }

                if (descriptionProperty.value.type !== "Literal") {
                  // We now support only string literal for description property
                  return;
                }

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
                      value: nameProperty.value.value,
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
});

module.exports = {
  RULE_NAME,
  RULE: linter.getRules().get(RULE_NAME),
};
