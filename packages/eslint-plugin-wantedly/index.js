const GraphQLCapitalizeType = require("./rules/GraphQLCapitalizeType");
const GraphQLOperationName = require("./rules/GraphQLOperationName");

module.exports = {
  rules: {
    [GraphQLCapitalizeType.RULE_NAME]: GraphQLCapitalizeType.RULE,
    [GraphQLOperationName.RULE_NAME]: GraphQLOperationName.RULE,
  },
};
