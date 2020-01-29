const { Linter } = require("eslint");
const { docsUrl } = require("./utils");

const linter = new Linter();
const RULE_NAME = "nexus-field-description";

const WHITELIST_FOR_TYPE_DEFINITION = ["objectType", "interfaceType", "inputObjectType"];
const FIELD_DEFINITION_METHODS = ["string", "int", "boolean", "id", "float", "field"];

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

      CallExpression(callExpression) {
        if (!isNexusUsed) {
          return;
        }

        const callee = callExpression.callee;
        if (callee.type !== "Identifier" || !WHITELIST_FOR_TYPE_DEFINITION.includes(callee.name)) {
          return;
        }

        const argument = callExpression.arguments[0];
        if (!argument || argument.type !== "ObjectExpression" || argument.properties.length <= 0) {
          return;
        }

        const definitionProperty = argument.properties.find(
          property => property.key && property.key.type === "Identifier" && property.key.name === "definition"
        );
        const definitions = definitionProperty.value.body.body;

        definitions.forEach(expressionStatement => {
          if (!FIELD_DEFINITION_METHODS.includes(expressionStatement.expression.callee.property.name)) {
            return;
          }

          const fieldNameNode = expressionStatement.expression.arguments[0];
          if (!fieldNameNode) {
            return;
          }

          const fieldName = fieldNameNode.value;
          const fieldConfigNode = expressionStatement.expression.arguments[1]; // ObjectExpression
          if (!fieldConfigNode) {
            return context.report({
              node: callExpression,
              message: "The field {{fieldName}} should have a description",
              data: {
                fieldName,
              },
            });
          }

          const descriptionProperty = fieldConfigNode.properties.find(
            property => property.key && property.key.type === "Identifier" && property.key.name === "description"
          );
          if (!descriptionProperty) {
            return context.report({
              node: callExpression,
              message: "The field {{fieldName}} should have a description",
              data: {
                fieldName,
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
              message: "The field {{fieldName}} should have a description",
              data: {
                fieldName,
              },
            });
          }
        });
      },
    };
  },
});

module.exports = {
  RULE_NAME,
  RULE: linter.getRules().get(RULE_NAME),
};
