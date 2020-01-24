const GraphQLCapitalizeType = require("./rules/GraphQLCapitalizeType");
const GraphQLOperationName = require("./rules/GraphQLOperationName");
const NexusPascalCaseTypeName = require("./rules/NexusPascalCaseTypeName");

module.exports = {
  rules: {
    [GraphQLCapitalizeType.RULE_NAME]: GraphQLCapitalizeType.RULE,
    [GraphQLOperationName.RULE_NAME]: GraphQLOperationName.RULE,
    [NexusPascalCaseTypeName.RULE_NAME]: NexusPascalCaseTypeName.RULE,
  },
};
