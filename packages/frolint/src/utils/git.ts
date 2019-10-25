import { execSync } from "child_process";
import { sync as commandExistsSync } from "command-exists";
import { readFileSync } from "fs";
import { resolve } from "path";
import { END_COMMENT, START_COMMENT } from "./constants";

export function isInsideGitRepository(cwd?: string) {
  try {
    return Boolean(
      execSync("git rev-parse --is-inside-work-tree", { cwd })
        .toString()
        .trim()
    );
  } catch (err) {
    return false;
  }
}

export function isGitExist() {
  return commandExistsSync("git");
}

export function getPreCommitHookPath(): string {
  return resolve(
    execSync("git rev-parse --git-path hooks")
      .toString()
      .trimRight(),
    "pre-commit"
  );
}

export function isPreCommitHookInstalled() {
  try {
    const data = readFileSync(getPreCommitHookPath(), "utf8");
    return data.indexOf(START_COMMENT) !== -1 && data.indexOf(END_COMMENT) !== -1;
  } catch (_) {
    return false;
  }
}

export function getGitRootDir(cwd: string) {
  if (!isGitExist()) {
    return cwd;
  }

  try {
    return resolve(
      cwd,
      execSync("git rev-parse --show-cdup")
        .toString()
        .trimRight()
    );
  } catch (err) {
    return cwd;
  }
}

export function getStagedFiles(rootDir: string) {
  if (!isGitExist()) {
    return [];
  }

  return execSync("git diff --cached --name-only --diff-filter=ACMRTUB", { cwd: rootDir })
    .toString()
    .trim()
    .split("\n");
}

export function getUnstagedFiles(rootDir: string) {
  if (!isGitExist()) {
    return [];
  }

  return execSync("git diff --name-only --diff-filter=ACMRTUB", { cwd: rootDir })
    .toString()
    .trim()
    .split("\n");
}

export function getChangedFilesFromBranch(branch: string, rootDir: string) {
  if (!isGitExist()) {
    return [];
  }

  const commitHash = execSync(`git show-branch --merge-base ${branch} HEAD`, { cwd: rootDir })
    .toString()
    .trim();

  return execSync(`git diff --name-only --diff-filter=ACMRTUB ${commitHash}`, { cwd: rootDir })
    .toString()
    .trim()
    .split("\n");
}

export function getAllFiles(isTypeScript: boolean, rootDir: string) {
  if (!isGitExist()) {
    return [];
  }

  const extensions = (isTypeScript ? [".js", ".jsx", ".ts", ".tsx"] : [".js", ".jsx"])
    .map(ext => `"**/*${ext}"`)
    .join(" ");

  return execSync(`git ls-files ${extensions}`, { cwd: rootDir })
    .toString()
    .trim()
    .split("\n");
}

export function stageFiles(files: string[], rootDir: string) {
  if (!isGitExist()) {
    return;
  }

  if (files.length > 0) {
    execSync(`git add ${files.join(" ")}`, { cwd: rootDir });
  }
}
