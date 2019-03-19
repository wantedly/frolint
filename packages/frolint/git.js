const execa = require("execa");

function getStagedFiles(cwd) {
  const { stdout } = execa.shellSync("git diff --cached --name-only --diff-filter=ACMRTUB", { cwd });

  return stdout.split("\n").filter(line => line.length > 0);
}

function getUnstagedFiles(cwd) {
  const { stdout } = execa.shellSync("git diff --name-only --diff-filter=ACMRTUB", { cwd });

  return stdout.split("\n").filter(line => line.length > 0);
}

function getAllFiles(cwd, extensions) {
  const { stdout } = execa.shellSync(`git ls-files ${extensions.map(ext => `*${ext}`).join(" ")}`, { cwd });

  return stdout.split("\n").filter(line => line.length > 0);
}

function getFilesBetweenCurrentAndBranch(cwd, branch) {
  const { stdout: commitHash } = execa.shellSync(`git show-branch --merge-base ${branch} HEAD`, { cwd });
  const { stdout } = execa.shellSync(`git diff --name-only --diff-filter=ACMRTUB ${commitHash}`, { cwd });

  return stdout.split("\n").filter(line => line.length > 0);
}

function stageFile(file, cwd) {
  execa.shellSync(`git add ${file}`, { cwd });
}

function isInsideGitRepository(cwd) {
  try {
    const { stdout } = execa.shellSync("git rev-parse --is-inside-working-tree", { cwd });
    return Boolean(stdout.trim());
  } catch (err) {
    return false;
  }
}

module.exports = {
  getStagedFiles,
  getUnstagedFiles,
  getAllFiles,
  getFilesBetweenCurrentAndBranch,
  stageFile,
  isInsideGitRepository,
};
