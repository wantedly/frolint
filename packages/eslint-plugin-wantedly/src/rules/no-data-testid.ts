import { Linter, Rule } from "eslint";
import { getProp } from "jsx-ast-utils";
import { docsUrl, getOptionWithDefault } from "./utils";

const linter = new Linter();
export const RULE_NAME = "no-data-testid";

const DEFAULT_OPTION = {
  denyKeyList: ["data-testid"],
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
    const option = getOptionWithDefault(context, DEFAULT_OPTION);
    return {
      JSXOpeningElement: (node: any) => {
        option.denyKeyList.forEach((key: string) => {
          const props = getProp(node.attributes, key);
          if (props) {
            context.report({
              node,
              message: "Attribute {{key}} is not allowed.",
              data: {
                key,
              },
            });
          }
        });
        return;
      },
    };
  },
});

export const RULE = linter.getRules().get(RULE_NAME) as Rule.RuleModule;
