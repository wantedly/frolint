const createUseMacro = require("../createUseMacro");

/** @type {import('eslint').Rule.RuleModule } */
module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
    schema: [
      {
        enum: ["error", "warn", "off"],
      },
    ],
  },
  create(context) {
    return {
      ImportDeclaration: createUseMacro("styled-components", "styled-components/macro", context),
    };
  },
};
