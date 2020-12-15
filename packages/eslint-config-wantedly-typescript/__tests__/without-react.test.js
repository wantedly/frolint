const ESLint = require("eslint").ESLint;
const baseConfig = require("../without-react");

const normalizePath = (path) => {
  return /node_modules/.test(path) ? path.split("node_modules")[1] : path;
};

describe("eslint-config-wantedly-typescript/without-react", () => {
  test("should match snapshot for", async () => {
    const config = await new ESLint({
      baseConfig,
      useEslintrc: false,
    }).calculateConfigForFile("test.ts");
    const keys = Object.keys(config);

    const normalizeRequiredKeys = ["extends", "parser"];
    normalizeRequiredKeys.forEach((key) => {
      const newConfig = config[key];

      if (Array.isArray(newConfig)) {
        config[key] = newConfig.map(normalizePath);
      } else {
        config[key] = normalizePath(newConfig);
      }
    });

    keys.forEach((key) => {
      expect(config[key]).toMatchSnapshot(key);
    });
  });
});
