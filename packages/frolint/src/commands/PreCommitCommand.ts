import { Command } from "clipanion";
import { FrolintContext } from "../Context";

export class PreCommitCommand extends Command<FrolintContext> {
  @Command.Rest()
  public gitParams: string[] = [];

  @Command.Path("pre-commit")
  public async execute() {
    this.context.stdout.write("Hello world");
  }
}
