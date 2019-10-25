import { Command } from "clipanion";
import { accessSync, constants, writeFileSync } from "fs";
import { FrolintContext } from "../Context";
import {
  END_COMMENT,
  getPreCommitHookPath,
  isGitExist,
  isInsideGitRepository,
  isPreCommitHookInstalled,
  START_COMMENT,
} from "../utils";

export class InstallCommand extends Command<FrolintContext> {
  public static usage = Command.Usage({
    description: "install git pre-commit hook for frolint",
    details: `
      This command will insert the pre-commit hook script into .git/hooks/pre-commit. If there is no .git/hooks/pre-commit, this command will create the script file.
    `,
  });

  @Command.Path("install")
  public async execute() {
    if (!isGitExist()) {
      return;
    }

    if (!isInsideGitRepository(this.context.cwd)) {
      return;
    }

    if (isPreCommitHookInstalled()) {
      this.context.stdout.write("Installed\n");
      return;
    }

    try {
      // Check the .git/hooks/pre-commit file is exists
      accessSync(getPreCommitHookPath(), constants.W_OK | constants.X_OK);

      // If the file exists, this command should append the content into the file
      writeFileSync(getPreCommitHookPath(), render({ append: true }), {
        flag: "a",
        mode: parseInt("0755", 8),
        encoding: "utf8",
      });
    } catch (err) {
      if (err) {
        if (err.code === "ENOENT") {
          // If the .git/hooks/pre-commit file is not exists
          try {
            // This command should create the file including the content
            writeFileSync(getPreCommitHookPath(), render({ append: false }), {
              flag: "w",
              mode: parseInt("0755", 8),
              encoding: "utf8",
            });
          } catch (err) {
            this.context.stderr.write(`Install failed: ${err.message}`);
            return 1;
          }
          return;
        }

        // Unknown error
        this.context.stderr.write(`Install failed: ${err.message}`);
        return 1;
      }
    }
  }
}

function render({ append }: { append: boolean }) {
  return `${append ? "" : "#!/bin/sh\n"}${START_COMMENT}

scriptPath="node_modules/frolint/lib/index.js"
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
