const ESLint = require("eslint").ESLint;
const baseConfig = require("../index");

const normalizePath = (path) => {
  return /node_modules/.test(path) ? path.split("node_modules")[1] : path;
};

describe("eslint-config-wantedly", () => {
  test("should match snapshot for", async () => {
    const config = await new ESLint({
      baseConfig,
      useEslintrc: false,
    }).calculateConfigForFile("test.js");
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
