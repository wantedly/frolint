const { pascalCase } = require("pascal-case");
const { Linter } = require("eslint");
const { getOptionWithDefault, docsUrl } = require("./utils");

const linter = new Linter();
const RULE_NAME = "graphql-pascal-case-type-name";

let GRAPHQL_INSTALLED = false;

try {
  require.resolve("graphql");
  GRAPHQL_INSTALLED = true;
} catch (_err) {
  GRAPHQL_INSTALLED = false;
}

// Represents the default option and schema for graphql-pascal-case-type-name option
const DEFAULT_OPTION = {
  autofix: false,
};

function createGraphQLCapitalizeTypeRule({ context, node, message, autofixEnabled }) {
  return function visitor(definition) {
    const typeName = definition.name.value;
    const pascalCased = pascalCase(typeName);

    if (typeName !== pascalCased) {
      const nameLocation = definition.name.loc;
      const [start] = node.quasi.range;
      const errorStart = start + nameLocation.start + 1;
      const errorEnd = start + nameLocation.start + typeName.length + 1;
      const sourceCode = context.getSourceCode();
      const locStart = sourceCode.getLocFromIndex(errorStart);
      const locEnd = sourceCode.getLocFromIndex(errorEnd);

      context.report({
        node,
        loc: { start: locStart, end: locEnd },
        message,
        data: {
          typeName,
        },
        fix(fixer) {
          if (autofixEnabled) {
            return fixer.replaceTextRange([errorStart, errorEnd], pascalCased);
          }
        },
      });
    }
  };
}

linter.defineRule(RULE_NAME, {
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      url: docsUrl(RULE_NAME),
    },
  },
  create(context) {
    if (!GRAPHQL_INSTALLED) {
      return {};
    }

    const option = getOptionWithDefault(context, DEFAULT_OPTION);
    const autofixEnabled = option.autofix;
    const graphql = require("graphql");

    return {
      TaggedTemplateExpression(node) {
        // We assume that the tag name is gql which is originated from 'graphql-tag' or 'graphql.macro'
        if (node.tag.type !== "Identifier" || node.tag.name !== "gql") {
          return;
        }

        if (!(node.quasi.quasis.length > 0)) {
          return;
        }

        /** @type {string[]} */
        const chunks = [];

        const invalid = node.quasi.quasis.some((elem, i) => {
          /** @type {string} */
          let chunk = elem.value.cooked;
          const value = node.quasi.expressions[i];

          /**
           * If the tagged template literal includes the interpolations,
           * we should preserve the interpolation position with whitespaces for the GraphQL token location.
           */
          if (value && value.name && value.name.length > 0) {
            chunk = chunk.concat(" ".repeat(value.name.length + 3));
          }

          chunks.push(chunk);

          if (chunk.split("{").length !== chunk.split("}").length) {
            context.report({
              node: value,
              message: "Interpolation must occur outside of the brackets",
            });
            return true;
          }

          return false;
        });

        if (invalid) {
          return;
        }

        const cooked = chunks.join("");
        const parsed = graphql.parse(cooked);

        graphql.visit(parsed, {
          InterfaceTypeDefinition: createGraphQLCapitalizeTypeRule({
            context,
            node,
            autofixEnabled,
            message: "The interface type {{ typeName }} should be PascalCase",
          }),

          ObjectTypeDefinition: createGraphQLCapitalizeTypeRule({
            context,
            node,
            autofixEnabled,
            message: "The object type {{ typeName }} should be PascalCase",
          }),

          FragmentDefinition: createGraphQLCapitalizeTypeRule({
            context,
            node,
            autofixEnabled,
            message: "The fragment {{ typeName }} should be PascalCase",
          }),
        });
      },
    };
  },
});

module.exports = {
  RULE_NAME,
  RULE: linter.getRules().get(RULE_NAME),
};
