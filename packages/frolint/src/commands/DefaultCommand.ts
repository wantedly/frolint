import { Command } from "clipanion";
import { FrolintContext } from "../Context";

export class DefaultCommand extends Command<FrolintContext> {
  public static usage = Command.Usage({
    description: "apply ESLint and Prettier",
  });

  @Command.Path()
  public async execute() {
    console.log("Hello world");
  }
}
