const { Linter } = require("eslint");
const { docsUrl } = require("./utils");

const linter = new Linter();
const RULE_NAME = "nexus-type-description";

const FUNCTION_WHITELIST = ["objectType", "unionType", "scalarType", "interfaceType", "inputObjectType", "enumType"];

linter.defineRule(RULE_NAME, {
  meta: {
    type: "suggestion",
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

      CallExpression(callExpression) {
        if (!isNexusUsed) {
          return;
        }

        const functionName = callExpression.callee.name;
        if (!FUNCTION_WHITELIST.includes(functionName)) {
          return;
        }

        const argumentDef = callExpression.arguments[0];
        if (!argumentDef) {
          return;
        }

        const nameProperty = argumentDef.properties.find(property => property.key.name === "name");
        if (!nameProperty) {
          return;
        }

        const typeName = nameProperty.value.value;
        const descriptionProperty = argumentDef.properties.find(property => property.key.name === "description");

        if (!descriptionProperty) {
          return context.report({
            node: callExpression,
            message: "The {{functionName}} {{typeName}} is missing a description",
            data: {
              functionName,
              typeName,
            },
          });
        }

        if (descriptionProperty.value.type !== "Literal") {
          // We now support only string literal for description property
          return;
        }

        const descriptionValue = descriptionProperty.value;
        if (descriptionValue && descriptionValue.value.trim().length === 0) {
          return context.report({
            node: callExpression,
            message: "The {{functionName}} {{typeName}} is missing a description",
            data: {
              functionName,
              typeName,
            },
          });
        }
      },
    };
  },
});

module.exports = {
  RULE_NAME,
  RULE: linter.getRules().get(RULE_NAME),
};
