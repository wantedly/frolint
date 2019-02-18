const path = require("path");
const CLIEngine = require("eslint").CLIEngine;

const ESLINT_CONFIG_FILE = path.resolve(__dirname, "..", "index.js");
const engine = new CLIEngine({
  configFile: ESLINT_CONFIG_FILE,
  useEslintrc: false,
});

describe("eslint-config-wantedly", () => {
  test("should match snapshot", () => {
    expect(engine.config.specificConfig).toMatchSnapshot();
  });
});
