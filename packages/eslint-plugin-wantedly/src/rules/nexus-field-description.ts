import type { Rule } from "eslint";
import type { Property } from "estree";

import { docsUrl, isNexusSchemaImported } from "./utils";

export const RULE_NAME = "nexus-field-description";

const WHITELIST_FOR_TYPE_DEFINITION = ["objectType", "interfaceType", "inputObjectType"];
const FIELD_DEFINITION_METHODS = ["string", "int", "boolean", "id", "float", "field"];

export const RULE: Rule.RuleModule = {
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
        if (isNexusSchemaImported(importDeclaration)) {
          isNexusUsed = true;
        } else return;
      },

      CallExpression(callExpression) {
        if (!isNexusUsed) return;

        if (callExpression.type !== "CallExpression") return;

        const callee = callExpression.callee;
        if (callee.type !== "Identifier" || !WHITELIST_FOR_TYPE_DEFINITION.includes(callee.name)) return;

        const argument = callExpression.arguments[0];
        if (!argument || argument.type !== "ObjectExpression" || argument.properties.length <= 0) return;

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
          if (expressionStatement.type !== "ExpressionStatement") return;
          if (expressionStatement.expression.type !== "CallExpression") return;
          if (expressionStatement.expression.callee.type !== "MemberExpression") return;
          if (expressionStatement.expression.callee.property.type !== "Identifier") return;

          if (!FIELD_DEFINITION_METHODS.includes(expressionStatement.expression.callee.property.name)) return;

          const fieldNameNode = expressionStatement.expression.arguments[0];
          if (!fieldNameNode) return;
          if (fieldNameNode.type !== "Literal") return;

          const fieldName = fieldNameNode.value as string;
          const fieldConfigNode = expressionStatement.expression.arguments[1]; // ObjectExpression
          if (!fieldConfigNode) {
            return context.report({
              node: expressionStatement.expression,
              message: "The field {{fieldName}} should have a description",
              data: {
                fieldName,
              },
            });
          }

          if (fieldConfigNode.type !== "ObjectExpression") return;

          const descriptionProperty = fieldConfigNode.properties.find(
            (property): property is Property =>
              property.type === "Property" &&
              property.key &&
              property.key.type === "Identifier" &&
              property.key.name === "description"
          );
          if (!descriptionProperty) {
            return context.report({
              node: fieldConfigNode,
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
          if (descriptionValue && (descriptionValue.value as string).trim().length === 0) {
            return context.report({
              node: descriptionProperty,
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
};
