import { Cli } from "clipanion";
import cosmiconfig from "cosmiconfig";
import { DefaultCommand, HelpCommand, InstallCommand, PreCommitCommand, UninstallCommand } from "./commands";
import { FrolintContext } from "./Context";
const pkg = require("../package.json");

const binaryName = "frolint";

const cli = new Cli<FrolintContext>({
  binaryLabel: "FROntend LINt Tool",
  binaryName,
  binaryVersion: pkg.version,
});

cli.register(DefaultCommand);
cli.register(HelpCommand);
cli.register(InstallCommand);
cli.register(PreCommitCommand);
cli.register(UninstallCommand);

const result = cosmiconfig(binaryName).searchSync();

// eslint-disable-next-line @typescript-eslint/no-floating-promises
cli.runExit(process.argv.slice(2), {
  stdin: process.stdin,
  stdout: process.stdout,
  stderr: process.stderr,
  cwd: process.cwd(),
  config: result ? result.config : undefined,
});
