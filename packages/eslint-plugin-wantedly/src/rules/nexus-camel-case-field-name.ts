import { camelCase } from "camel-case";
import { Linter, Rule } from "eslint";
import type { Property } from "estree";
import { docsUrl, getOptionWithDefault, isNexusSchemaImported } from "./utils";

const linter = new Linter();
export const RULE_NAME = "nexus-camel-case-field-name";

const ALLOWLIST_FOR_TYPE_DEFINITION = ["objectType", "interfaceType", "inputObjectType"];
const FIELD_DEFINITION_METHODS = ["string", "int", "boolean", "id", "float", "field"];

// Represents the default option and schema for nexus-camel-case-field-name option
const DEFAULT_OPTION = {
  autofix: false,
};

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
    const option = getOptionWithDefault(context, DEFAULT_OPTION);
    const autofixEnabled = option.autofix;

    return {
      ImportDeclaration(importDeclaration) {
        if (isNexusSchemaImported(importDeclaration)) {
          isNexusUsed = true;
        } else {
          return;
        }
      },

      CallExpression(callExpression) {
        if (!isNexusUsed) return;
        if (callExpression.type !== "CallExpression") return;

        const callee = callExpression.callee;
        if (callee.type !== "Identifier" || !ALLOWLIST_FOR_TYPE_DEFINITION.includes(callee.name)) {
          return;
        }

        const argument = callExpression.arguments[0];
        if (!argument || argument.type !== "ObjectExpression" || argument.properties.length <= 0) {
          return;
        }

        const definitionProperty = argument.properties.find(
          (property): property is Property =>
            property.type === "Property" &&
            property.key &&
            property.key.type === "Identifier" &&
            property.key.name === "definition"
        );
        if (!definitionProperty) return;
        if (definitionProperty.value.type !== "FunctionExpression") return;

        const definitions = definitionProperty.value.body.body;

        definitions.forEach((expressionStatement) => {
          if (
            expressionStatement.type !== "ExpressionStatement" ||
            !expressionStatement.expression ||
            expressionStatement.expression.type !== "CallExpression" ||
            !expressionStatement.expression.callee ||
            expressionStatement.expression.callee.type !== "MemberExpression" ||
            !expressionStatement.expression.callee.property ||
            expressionStatement.expression.callee.property.type !== "Identifier" ||
            !expressionStatement.expression.callee.property.name
          ) {
            return;
          }
          if (!FIELD_DEFINITION_METHODS.includes(expressionStatement.expression.callee.property.name)) {
            return;
          }
          if (!expressionStatement.expression || expressionStatement.expression.arguments.length === 0) {
            return;
          }

          const fieldNameNode = expressionStatement.expression.arguments[0];
          if (!fieldNameNode || fieldNameNode.type !== "Literal") return;
          const fieldName = fieldNameNode.value;
          if (!fieldName || typeof fieldName !== "string") return;
          const camelCased = camelCase(fieldName);

          if (fieldName && camelCased && fieldName !== camelCased) {
            const [start, end] = fieldNameNode.range ?? [0, 0];
            return context.report({
              node: fieldNameNode,
              message: "The field {{ fieldName }} should be camelCase",
              data: {
                fieldName,
              },
              fix(fixer) {
                if (autofixEnabled) {
                  return fixer.replaceTextRange([start + 1, end - 1], camelCased);
                }
                return null;
              },
            });
          }
        });
      },
    };
  },
});

export const RULE = linter.getRules().get(RULE_NAME) as Rule.RuleModule;
