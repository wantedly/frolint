import { Command } from "clipanion";
import { FrolintContext } from "../Context";
import { gitExists, isInsideGitRepository } from "../utils";

export class UninstallCommand extends Command<FrolintContext> {
  public static usage = Command.Usage({
    description: "uninstall git pre-commit hook for frolint",
    details: `
      This command will remove the pre-commit hook script from .git/hooks/pre-commit.
    `,
  });

  @Command.Path("uninstall")
  public async execute() {
    if (!gitExists()) {
      return;
    }

    if (!isInsideGitRepository(this.context.cwd)) {
      return;
    }

    this.context.stdout.write("Uninstall");
  }
}
