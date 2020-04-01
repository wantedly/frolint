module.exports = function createUseMacro(from, to, context) {
  let BABEL_PLUGIN_MACROS_INSTALLED = false;
  let TARGET_LIBRARY_INSTALLED = false;

  try {
    require.resolve("babel-plugin-macros");
    BABEL_PLUGIN_MACROS_INSTALLED = true;
  } catch (_err) {
    BABEL_PLUGIN_MACROS_INSTALLED = false;
  }

  try {
    require.resolve(to);
    TARGET_LIBRARY_INSTALLED = true;
  } catch (_err) {
    TARGET_LIBRARY_INSTALLED = false;
  }

  return function (node) {
    const importName = node.source.value.trim();

    if (importName === from) {
      if (!BABEL_PLUGIN_MACROS_INSTALLED) {
        context.report({
          node,
          message: "Please install 'babel-plugin-macro' to use macro",
        });
        return;
      }

      if (!TARGET_LIBRARY_INSTALLED) {
        context.report({
          node,
          message: "Please install {{to}} to use macro",
          data: {
            to,
          },
        });
        return;
      }

      const [start, end] = node.source.range;
      context.report({
        node,
        message: 'Please import from "{{to}}" instead of "{{from}}"',
        data: { from, to },
        fix(fixer) {
          return fixer.replaceTextRange([start + 1, end - 1], to);
        },
      });
    }
  };
};
