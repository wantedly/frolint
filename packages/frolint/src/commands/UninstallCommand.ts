import { Command } from "clipanion";
import { accessSync, constants, readFileSync, writeFileSync } from "fs";
import { FrolintContext } from "../Context";
import { END_COMMENT, START_COMMENT } from "../utils/constants";
import { getPreCommitHookPath, isGitExist, isInsideGitRepository, isPreCommitHookInstalled } from "../utils/git";

export class UninstallCommand extends Command<FrolintContext> {
  public static usage = Command.Usage({
    description: "uninstall git pre-commit hook for frolint",
    details: `
      This command will remove the pre-commit hook script from .git/hooks/pre-commit.
    `,
  });

  @Command.Path("uninstall")
  public async execute() {
    if (!isGitExist()) {
      return;
    }

    if (!isInsideGitRepository(this.context.cwd)) {
      return;
    }

    if (!isPreCommitHookInstalled()) {
      this.context.stdout.write("Not installed");
      return;
    }

    try {
      // Check the .git/hooks/pre-commit fiel is exists
      accessSync(getPreCommitHookPath(), constants.R_OK | constants.W_OK | constants.X_OK);

      const content = readFileSync(getPreCommitHookPath(), "utf8");
      const newContent: string[] = [];
      const lines = content.split("\n");
      let ignore = false;
      lines.forEach(line => {
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

      writeFileSync(getPreCommitHookPath(), newContent.join("\n"), { flag: "w", mode: parseInt("0755", 8) });
    } catch (err) {
      this.context.stderr.write(`Uninstall failed: ${err.message}`);
      return 1;
    }

    this.context.stdout.write("Uninstall");
  }
}
