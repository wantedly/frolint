const ESLint = require("eslint").ESLint;
const { base, react } = require("../index");

describe("eslint-config-wantedly-typescript", () => {
  describe("base", () => {
    test("should match snapshot for", async () => {
      const config = await new ESLint({
        baseConfig: base,
        overrideConfigFile: true,
      }).calculateConfigForFile("test.ts");
      expect(config).toMatchSnapshot();
    });
  });

  describe("react", () => {
    test("should match snapshot for", async () => {
      const config = await new ESLint({
        baseConfig: react,
        overrideConfigFile: true,
      }).calculateConfigForFile("test.ts");
      expect(config).toMatchSnapshot();
    });
  });
});
