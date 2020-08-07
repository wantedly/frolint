import * as GRAPHQL_OPERATION_NAME from "./rules/graphql-operation-name";
import * as GRAPHQL_PASCAL_CASE_TYPE_NAME from "./rules/graphql-pascal-case-type-name";
import * as NEXUS_CAMEL_CASE_FIELD_NAME from "./rules/nexus-camel-case-field-name";
import * as NEXUS_ENUM_VALUES_DESCRIPTION from "./rules/nexus-enum-values-description";
import * as NEXUS_FIELD_DESCRIPTION from "./rules/nexus-field-description";
import * as NEXUS_PASCAL_CASE_TYPE_NAME from "./rules/nexus-pascal-case-type-name";
import * as NEXUS_TYPE_DESCRIPTION from "./rules/nexus-type-description";
import * as NEXUS_UPPER_CASE_ENUM_MEMBERS from "./rules/nexus-upper-case-enum-members";
import * as NO_DATA_TESTID from "./rules/no-data-testid";

export const rules = {
  [GRAPHQL_OPERATION_NAME.RULE_NAME]: GRAPHQL_OPERATION_NAME.RULE,
  [GRAPHQL_PASCAL_CASE_TYPE_NAME.RULE_NAME]: GRAPHQL_PASCAL_CASE_TYPE_NAME.RULE,
  [NEXUS_CAMEL_CASE_FIELD_NAME.RULE_NAME]: NEXUS_CAMEL_CASE_FIELD_NAME.RULE,
  [NEXUS_ENUM_VALUES_DESCRIPTION.RULE_NAME]: NEXUS_ENUM_VALUES_DESCRIPTION.RULE,
  [NEXUS_FIELD_DESCRIPTION.RULE_NAME]: NEXUS_FIELD_DESCRIPTION.RULE,
  [NEXUS_PASCAL_CASE_TYPE_NAME.RULE_NAME]: NEXUS_PASCAL_CASE_TYPE_NAME.RULE,
  [NEXUS_TYPE_DESCRIPTION.RULE_NAME]: NEXUS_TYPE_DESCRIPTION.RULE,
  [NEXUS_UPPER_CASE_ENUM_MEMBERS.RULE_NAME]: NEXUS_UPPER_CASE_ENUM_MEMBERS.RULE,
  [NO_DATA_TESTID.RULE_NAME]: NO_DATA_TESTID.RULE,
};
