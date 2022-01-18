const RuleTester = require("eslint").RuleTester;
const ESLintConfigWantedly = require("eslint-config-wantedly-typescript");
const StyledComponentsRule = require("../rules/StyledComponents");

RuleTester.setDefaultConfig({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
});

const ruleTester = new RuleTester();
ruleTester.run("use-macros/styled-components", StyledComponentsRule, {
  valid: [
    {
      code: `import styled from "styled-components/macro";`,
    },
  ],
  invalid: [
    {
      code: `import styled from "styled-components";`,
      output: `import styled from "styled-components/macro";`,
      errors: ['Please import from "styled-components/macro" instead of "styled-components"'],
    },
  ],
});
