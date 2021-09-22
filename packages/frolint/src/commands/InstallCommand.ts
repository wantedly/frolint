import { Command } from "clipanion";
import { accessSync, constants, writeFileSync } from "fs";
import type { FrolintContext } from "../Context";
import { END_COMMENT, HOOKS_CATEGORY, START_COMMENT } from "../utils/constants";
import { getPreCommitHookPath, isGitExist, isInsideGitRepository, isPreCommitHookInstalled } from "../utils/git";
import { isInstanceOfNodeError } from "../utils/isInstanceOfNodeError";

export class InstallCommand extends Command<FrolintContext> {
  public static usage = Command.Usage({
    category: HOOKS_CATEGORY,
    description: "install git pre-commit hook for frolint",
    details: `
      This command will insert the pre-commit hook script into .git/hooks/pre-commit. If there is no .git/hooks/pre-commit, this command will create the script file.
    `,
  });

  @Command.Path("install")
  public async execute() {
    const log = this.context.debug("InstallCommand");

    log("Start to execute");

    if (!isGitExist()) {
      log("Command `git` is not exist");
      return 0;
    }

    if (!isInsideGitRepository(this.context.cwd)) {
      log("Current working directory is not a git project");
      return 0;
    }

    if (isPreCommitHookInstalled()) {
      log("pre-commit hook script is already installed");
      this.context.stdout.write("Installed\n");
      return 0;
    }

    try {
      log("Check the pre-commit hook file (%s) is exists", getPreCommitHookPath());
      accessSync(getPreCommitHookPath(), constants.W_OK | constants.X_OK);

      log("Append code to pre-commit hook file (%s) for calling frolint", getPreCommitHookPath());
      // If the file exists, this command should append the content into the file
      writeFileSync(getPreCommitHookPath(), render({ append: true }), {
        flag: "a",
        mode: parseInt("0755", 8),
        encoding: "utf8",
      });
    } catch (err) {
      if (isInstanceOfNodeError(err)) {
        if (err.code === "ENOENT") {
          log("The pre-commit hook file (%s) is not exists", getPreCommitHookPath());
          // If the .git/hooks/pre-commit file is not exists
          try {
            log("Create pre-commit hook file (%s)", getPreCommitHookPath());
            // This command should create the file including the content
            writeFileSync(getPreCommitHookPath(), render({ append: false }), {
              flag: "w",
              mode: parseInt("0755", 8),
              encoding: "utf8",
            });
          } catch (err) {
            if (isInstanceOfNodeError(err)) {
              log("Cannot create pre-commit hook file");
              this.context.stderr.write(`Install failed: ${err.message}`);
            }
            return 1;
          }
          return 0;
        }

        log("Unknown error occurred...");
        // Unknown error
        this.context.stderr.write(`Install failed: ${err.message}`);
        return 1;
      }
    }

    this.context.stdout.write("Installed\n");
    log("Execution finished");

    return 0;
  }
}

function render({ append }: { append: boolean }) {
  return `${append ? "" : "#!/bin/sh\n"}${START_COMMENT}

scriptPath="node_modules/frolint/index.js"
hookName="pre-commit"
gitParams="$*"

if ! command -v node >/dev/null 2>&1; then
  echo "Can't find node in PATH, trying to find a node binary on your system"
fi
if [ -f $scriptPath ]; then
  node $scriptPath $hookName "$gitParams"
fi

${END_COMMENT}
`;
}
