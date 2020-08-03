import { Linter, Rule } from "eslint";
import { Property } from "estree";
import { snakeCase } from "snake-case";
import { docsUrl } from "./utils";

const linter = new Linter();
export const RULE_NAME = "nexus-type-description";

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
          importDeclaration.type === "ImportDeclaration" &&
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

        if (callExpression.type !== "CallExpression" || callExpression.callee.type !== "Identifier") {
          return;
        }

        const functionName = callExpression.callee.name;
        if (!FUNCTION_WHITELIST.includes(functionName)) {
          return;
        }

        const argumentDef = callExpression.arguments[0];
        if (!argumentDef || argumentDef.type !== "ObjectExpression") {
          return;
        }

        const nameProperty = argumentDef.properties.find(
          (property): property is Property =>
            property.type === "Property" && property.key.type === "Identifier" && property.key.name === "name"
        );
        if (!nameProperty || nameProperty.value.type !== "Literal") {
          return;
        }

        const typeName = nameProperty.value.value as string;
        const descriptionProperty = argumentDef.properties.find(
          (property): property is Property =>
            property.type === "Property" && property.key.type === "Identifier" && property.key.name === "description"
        );

        if (!descriptionProperty) {
          return context.report({
            node: callExpression,
            message: "The {{functionName}} {{typeName}} should have a description",
            data: {
              functionName: snakeCase(functionName).replace(/_/g, " "),
              typeName,
            },
          });
        }

        if (descriptionProperty.value.type !== "Literal") {
          // We now support only string literal for description property
          return;
        }

        const descriptionValue = descriptionProperty.value;
        if (typeof descriptionValue.value !== "string") {
          return;
        }

        if (descriptionValue && descriptionValue.value.trim().length === 0) {
          return context.report({
            node: callExpression,
            message: "The {{functionName}} {{typeName}} should have a description",
            data: {
              functionName: snakeCase(functionName).replace(/_/g, " "),
              typeName,
            },
          });
        }
      },
    };
  },
});

export const RULE = linter.getRules().get(RULE_NAME) as Rule.RuleModule;
