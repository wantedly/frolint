import { execSync } from "child_process";
import { sync as commandExistsSync } from "command-exists";
import { readFileSync } from "fs";
import { resolve } from "path";

export const START_COMMENT = "# DO NOT EDIT frolint START";
export const END_COMMENT = "# DO NOT EDIT frolint END";

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
