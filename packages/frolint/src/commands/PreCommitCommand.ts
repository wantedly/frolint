import { Command } from "clipanion";
import type { FrolintContext } from "../Context.js";

export class PreCommitCommand extends Command<FrolintContext> {
  @Command.Rest()
  public gitParams: string[] = [];

  @Command.Path("pre-commit")
  public async execute() {
    const log = this.context.debug("PreCommitCommand");

    log("pre-commit hook execution. Delegate operation to DefaultCommand");
    return await this.cli.run([], { preCommit: true });
  }
}
