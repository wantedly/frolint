const ogh = require("@yamadayuki/ogh");
const fs = require("fs");
const path = require("path");
const { SAMPLE_PRETTIER_CONFIG_FILE } = require("./base");

function exportPrettierConfig(args, _config) {
  const rootDir = ogh.extractGitRootDirFromArgs(args);

  const prettierConfig = fs.readFileSync(SAMPLE_PRETTIER_CONFIG_FILE).toString();
  fs.writeFile(path.resolve(rootDir, ".prettierrc"), prettierConfig, err => {
    if (err) {
      console.error(err);
    }
  });
}

module.exports = {
  exportPrettierConfig,
};
