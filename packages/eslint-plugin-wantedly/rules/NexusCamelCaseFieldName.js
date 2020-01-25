const { camelCase } = require("camel-case");
const { Linter } = require("eslint");
const { getOptionWithDefault } = require("./utils");

const linter = new Linter();
const RULE_NAME = "nexus-camel-case-field-name";

// Represents the default option and schema for graphql-operation-name option
const DEFAULT_OPTION = {
  autofix: false,
};

const WHITELIST_FOR_TYPE_DEFINITION = ["objectType", "interfaceType", "inputObjectType"];
const FIELD_DEFINITION_METHODS = ["string", "int", "boolean", "id", "float", "field"];

linter.defineRule(RULE_NAME, {
  meta: {
    type: "suggestion",
    fixable: "code",
  },
  create(context) {
    let isNexusUsed = false;
    const option = getOptionWithDefault(context, DEFAULT_OPTION);
    const autofixEnabled = option.autofix;

    return {
      ImportDeclaration(importDeclaration) {
        if (
          importDeclaration.source &&
          importDeclaration.source.type === "Literal" &&
          importDeclaration.source.value === "nexus"
        ) {
          isNexusUsed = true;
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
          const fieldName = fieldNameNode.value;
          const camelCased = camelCase(fieldName);

          if (fieldName && camelCased && fieldName !== camelCased) {
            const [start, end] = fieldNameNode.range;
            context.report({
              node: fieldNameNode,
              message: "The field {{ fieldName }} should be camelCase",
              data: {
                fieldName,
              },
              fix(fixer) {
                if (autofixEnabled) {
                  return fixer.replaceTextRange([start + 1, end - 1], camelCased);
                }
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
