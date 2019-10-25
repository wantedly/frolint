import { Command } from "clipanion";
import { FrolintContext } from "../Context";

export class HelpCommand extends Command<FrolintContext> {
  @Command.Path("--help")
  @Command.Path("-h")
  public async execute() {
    this.context.stdout.write(this.cli.usage(null));
  }
}
