const FROM = "graphql-tag";
const TO = "graphql.macro";

let BABEL_PLUGIN_MACROS_INSTALLED = false;
let GRAPHQL_MACRO_INSTALLED = false;

try {
  require.resolve("babel-plugin-macros");
  BABEL_PLUGIN_MACROS_INSTALLED = true;
} catch (_err) {
  BABEL_PLUGIN_MACROS_INSTALLED = false;
}

try {
  require.resolve(TO);
  GRAPHQL_MACRO_INSTALLED = true;
} catch (_err) {
  GRAPHQL_MACRO_INSTALLED = false;
}

module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (!BABEL_PLUGIN_MACROS_INSTALLED) {
          context.report({
            node,
            message: 'Please install "babel-plugin-macro" to use macro',
          });
          return;
        }

        const importName = node.source.value.trim();

        if (importName === FROM) {
          if (!GRAPHQL_MACRO_INSTALLED) {
            context.report({
              node,
              message: 'Please install "graphql.macro" to use macro',
            });
            return;
          }

          const specifier = node.specifiers[0];
          const [start, end] = node.source.range;
          context.report({
            node,
            message: 'Please import from "graphql.macro" instead of "graphql-tag"',
            fix(fixer) {
              return [
                fixer.replaceTextRange(specifier.range, "{ gql }"),
                fixer.replaceTextRange([start + 1, end - 1], TO),
              ];
            },
          });
        }
      },
    };
  },
};
