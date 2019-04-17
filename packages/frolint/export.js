const ogh = require("@yamadayuki/ogh");
const fs = require("fs");
const path = require("path");

const TEMPLATE = `"prettier-config-wantedly"\n`;

function exportPrettierConfig(args, _config) {
  const rootDir = ogh.extractGitRootDirFromArgs(args);

  fs.writeFile(path.resolve(rootDir, ".prettierrc"), TEMPLATE, err => {
    if (err) {
      console.error(err);
    }
  });
}

module.exports = {
  exportPrettierConfig,
};
