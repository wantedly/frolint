const RuleTester = require("eslint").RuleTester;

const StyledComponentsRule = require("../rules/StyledComponents");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
  },
});
ruleTester.run("use-macros/styled-components", StyledComponentsRule, {
  valid: [
    {
      code: `import styled from "styled-components/macro";`,
      options: ["error"],
    },
  ],
  invalid: [
    {
      code: `import styled from "styled-components";`,
      output: `import styled from "styled-components/macro";`,
      errors: ['Please import from "styled-components/macro" instead of "styled-components"'],
      options: ["error"],
    },
  ],
});
