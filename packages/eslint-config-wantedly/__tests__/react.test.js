const path = require("path");
const CLIEngine = require("eslint").CLIEngine;

const ESLINT_CONFIG_FILE = path.resolve(__dirname, "..", "react.js");
const engine = new CLIEngine({
  configFile: ESLINT_CONFIG_FILE,
  useEslintrc: false,
});

const normalizePath = path => {
  return /node_modules/.test(path) ? path.split("node_modules")[1] : path;
};

describe("eslint-config-wantedly/react", () => {
  const config = engine.config.getConfig();
  const keys = Object.keys(config);

  beforeAll(() => {
    const normalizeRequiredKeys = ["extends", "parser"];
    normalizeRequiredKeys.forEach(key => {
      const newConfig = config[key];

      if (Array.isArray(newConfig)) {
        config[key] = newConfig.map(normalizePath);
      } else {
        config[key] = normalizePath(newConfig);
      }
    });
  });

  keys.forEach(key => {
    test(`should match snapshot for ${key}`, () => {
      expect(config[key]).toMatchSnapshot();
    });
  });
});
