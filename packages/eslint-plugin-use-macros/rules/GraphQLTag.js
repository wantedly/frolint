const createUseMacro = require("../createUseMacro");

module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
  },
  create(context) {
    return {
      ImportDeclaration: createUseMacro("graphql-tag", "graphql-tag.macro", context),
    };
  },
};
