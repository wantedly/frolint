const execa = require("execa");

function getStagedFiles(cwd) {
  const { stdout } = execa.commandSync("git diff --cached --name-only --diff-filter=ACMRTUB", { cwd, shell: true });

  return stdout.split("\n").filter(line => line.length > 0);
}

function getUnstagedFiles(cwd) {
  const { stdout } = execa.commandSync("git diff --name-only --diff-filter=ACMRTUB", { cwd, shell: true });

  return stdout.split("\n").filter(line => line.length > 0);
}

function getAllFiles(cwd, extensions) {
  const { stdout } = execa.commandSync(`git ls-files ${extensions.map(ext => `"**/*${ext}"`).join(" ")}`, {
    cwd,
    shell: true,
  });

  return stdout.split("\n").filter(line => line.length > 0);
}

function getFilesBetweenCurrentAndBranch(cwd, branch) {
  const { stdout: commitHash } = execa.commandSync(`git show-branch --merge-base ${branch} HEAD`, { cwd, shell: true });
  const { stdout } = execa.commandSync(`git diff --name-only --diff-filter=ACMRTUB ${commitHash}`, {
    cwd,
    shell: true,
  });

  return stdout.split("\n").filter(line => line.length > 0);
}

function stageFile(file, cwd) {
  execa.commandSync(`git add ${file}`, { cwd, shell: true });
}

function isInsideGitRepository(cwd) {
  try {
    const { stdout } = execa.commandSync("git rev-parse --is-inside-working-tree", { cwd, shell: true });
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
