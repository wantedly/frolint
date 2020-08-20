import { TSESLint } from "@typescript-eslint/experimental-utils";
import { docsUrl, getOptionWithDefault } from "./utils";

const linter = new TSESLint.Linter();
export const RULE_NAME = "no-data-testid";

const DEFAULT_OPTION = {
  denyKeyList: ["data-testid"],
};

linter.defineRule(RULE_NAME, {
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      category: "Stylistic Issues",
      description: "Disallow specific keys as jsx props",
      recommended: "error",
      url: docsUrl(RULE_NAME),
    },
    messages: {
      noDataTestId: "Attribute {{key}} is not allowed.",
    },
    schema: [
      {
        type: "object",
        properties: {
          denyKeyList: {
            type: "array",
            default: ["data-testid"],
          }
        }
      }
    ],
  },
  create(context) {
    const option = getOptionWithDefault(context, DEFAULT_OPTION);
    return {
      JSXAttribute: (node) => {
        option.denyKeyList.forEach((key: string) => {
          if (key === node.name.name) {
            context.report({
              loc: node.loc,
              messageId: "noDataTestId",
              data: {
                key
              }
            })
          }
        })
      },
    };
  },
});

export const RULE = linter.getRules().get(RULE_NAME) as TSESLint.RuleModule<string, unknown[], TSESLint.RuleListener>;
