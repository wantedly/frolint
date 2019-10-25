import { execSync } from "child_process";
import { sync as commandExistsSync } from "command-exists";

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

export function gitExists() {
  return commandExistsSync("git");
}
