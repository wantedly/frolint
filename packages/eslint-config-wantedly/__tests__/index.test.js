const ESLint = require("eslint").ESLint;
const { base, react } = require("../index");

describe("eslint-config-wantedly", () => {
  describe("base", () => {
    test("should match snapshot for", async () => {
      const config = await new ESLint({
        baseConfig: base,
        overrideConfigFile: true,
      }).calculateConfigForFile("test.js");
      expect(config).toMatchSnapshot();
    });
  });

  describe("react", () => {
    test("should match snapshot for", async () => {
      const config = await new ESLint({
        baseConfig: react,
        overrideConfigFile: true,
      }).calculateConfigForFile("test.js");
      expect(config).toMatchSnapshot();
    });
  });
});
