const ogh = require("@yamadayuki/ogh");
const execa = require("execa");
const eslint = require("eslint");
const fs = require("fs");
const path = require("path");

function getStagedFiles(cwd) {
  const { stdout } = execa.shellSync(
    "git diff --cached --name-only --diff-filter=ACMRTUB",
    { cwd }
  );

  return stdout.split("\n").filter(line => line.length > 0);
}

function getUnstagedFiles(cwd) {
  const { stdout } = execa.shellSync(
    "git diff --name-only --diff-filter=ACMRTUB",
    { cwd }
  );

  return stdout.split("\n").filter(line => line.length > 0);
}

function isSupportedExtension(file) {
  return /(jsx?|tsx?)$/.test(file);
}

function stageFile(file, cwd) {
  execa.shellSync(`git add ${file}`, { cwd });
}

function getRelativePath(cwd, absolutePath) {
  if (absolutePath.startsWith(cwd)) {
    return path.relative(cwd, absolutePath);
  }

  return absolutePath;
}

function preCommitHook(args, _config) {
  const rootDir = ogh.extractGitRootDirFromArgs(args);
  const staged = getStagedFiles(rootDir);
  const unstaged = getUnstagedFiles(rootDir);

  const cli = new eslint.CLIEngine({
    baseConfig: {
      extends: ["wantedly"],
    },
    fix: true,
    cwd: rootDir,
  });

  const isFullyStaged = file => {
    return !unstaged.includes(getRelativePath(rootDir, file));
  };

  const files = Array.from(new Set([...staged, ...unstaged]));
  const report = cli.executeOnFiles(files.filter(isSupportedExtension));

  report.results.forEach(result => {
    // eslint-disable-next-line no-console
    console.log(result);

    const { filePath, output } = result;
    if (output) {
      fs.writeFileSync(filePath, output);

      if (isFullyStaged(filePath)) {
        stageFile(args, getRelativePath(rootDir, filePath));
      }
    }
  });
}

module.exports = {
  preCommitHook,
};
