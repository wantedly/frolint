const graphqlOperationName = require("./rules/graphql-operation-name");
const graphqlPascalCaseTypeName = require("./rules/graphql-pascal-case-type-name");
const nexusCamelCaseFieldName = require("./rules/nexus-camel-case-field-name");
const nexusPascalCaseTypeName = require("./rules/nexus-pascal-case-type-name");
const nexusTypeDescription = require("./rules/nexus-type-description");
const nexusUpperCaseEnumMembers = require("./rules/nexus-upper-case-enum-members");

module.exports = {
  rules: {
    [graphqlOperationName.RULE_NAME]: graphqlOperationName.RULE,
    [graphqlPascalCaseTypeName.RULE_NAME]: graphqlPascalCaseTypeName.RULE,
    [nexusCamelCaseFieldName.RULE_NAME]: nexusCamelCaseFieldName.RULE,
    [nexusPascalCaseTypeName.RULE_NAME]: nexusPascalCaseTypeName.RULE,
    [nexusTypeDescription.RULE_NAME]: nexusTypeDescription.RULE,
    [nexusUpperCaseEnumMembers.RULE_NAME]: nexusUpperCaseEnumMembers.RULE,
  },
};
