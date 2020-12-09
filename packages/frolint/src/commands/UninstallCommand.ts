import { Command } from "clipanion";
import { accessSync, constants, readFileSync, writeFileSync } from "fs";
import type { FrolintContext } from "../Context";
import { END_COMMENT, HOOKS_CATEGORY, START_COMMENT } from "../utils/constants";
import { getPreCommitHookPath, isGitExist, isInsideGitRepository, isPreCommitHookInstalled } from "../utils/git";

export class UninstallCommand extends Command<FrolintContext> {
  public static usage = Command.Usage({
    category: HOOKS_CATEGORY,
    description: "uninstall git pre-commit hook for frolint",
    details: `
      This command will remove the pre-commit hook script from .git/hooks/pre-commit.
    `,
  });

  @Command.Path("uninstall")
  public async execute() {
    const log = this.context.debug("UninstallCommand");

    log("Start to execute");

    if (!isGitExist()) {
      log("Command `git` is not exist");
      return 0;
    }

    if (!isInsideGitRepository(this.context.cwd)) {
      log("Current working directory is not a git project");
      return 0;
    }

    if (!isPreCommitHookInstalled()) {
      this.context.stdout.write("Not installed");
      log("pre-commit hook script is already installed");
      return 0;
    }

    try {
      log("Check the pre-commit hook file (%s) is exists", getPreCommitHookPath());
      accessSync(getPreCommitHookPath(), constants.R_OK | constants.W_OK | constants.X_OK);

      log("Extract code running frolint");
      const content = readFileSync(getPreCommitHookPath(), "utf8");
      const newContent: string[] = [];
      const lines = content.split("\n");
      let ignore = false;
      lines.forEach((line) => {
        if (line === START_COMMENT) {
          ignore = true;
        }

        if (!ignore) {
          newContent.push(line);
        }

        if (line === END_COMMENT) {
          ignore = false;
        }
      });

      log("Remove code from pre-commit hook file (%s)", getPreCommitHookPath());
      writeFileSync(getPreCommitHookPath(), newContent.join("\n"), { flag: "w", mode: parseInt("0755", 8) });
    } catch (err) {
      log("Unknown error occurred: %O", err);
      this.context.stderr.write(`Uninstall failed: ${err.message}`);
      return 1;
    }

    this.context.stdout.write("Uninstalled");
    log("Execution finished");

    return 0;
  }
}
