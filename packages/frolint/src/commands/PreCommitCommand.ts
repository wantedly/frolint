import { Command } from "clipanion";
import type { FrolintContext } from "../Context";

export class PreCommitCommand extends Command<FrolintContext> {
  @Command.Rest()
  public gitParams: string[] = [];

  @Command.Path("pre-commit")
  public async execute() {
    return await this.cli.run([], { preCommit: true });
  }
}
