import { Cli } from "clipanion";
import { cosmiconfigSync } from "cosmiconfig";
import { DefaultCommand } from "./commands/DefaultCommand";
import { ExportCommand } from "./commands/ExportCommand";
import { HelpCommand } from "./commands/HelpCommand";
import { InstallCommand } from "./commands/InstallCommand";
import { PreCommitCommand } from "./commands/PreCommitCommand";
import { PrintConfigCommand } from "./commands/PrintConfigCommand";
import { UninstallCommand } from "./commands/UninstallCommand";
import { VersionCommand } from "./commands/VersionCommand";
import type { FrolintConfig, FrolintContext } from "./Context";

const binaryName = "frolint";
const binaryVersion = "2.3.0";

const cli = new Cli<FrolintContext>({
  binaryLabel: "FROntend LINt Tool",
  binaryName,
  binaryVersion,
});

cli.register(DefaultCommand);
cli.register(ExportCommand);
cli.register(HelpCommand);
cli.register(InstallCommand);
cli.register(PreCommitCommand);
cli.register(PrintConfigCommand);
cli.register(UninstallCommand);
cli.register(VersionCommand);

const result = cosmiconfigSync(binaryName).search();

let config: FrolintConfig = {
  typescript: true,
  eslint: {},
  prettier: {},
};

if (result && result.config) {
  config = {
    ...config,
    ...result.config,
  };
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
cli.runExit(process.argv.slice(2), {
  stdin: process.stdin,
  stdout: process.stdout,
  stderr: process.stderr,
  cwd: process.cwd(),
  config,
  preCommit: false,
  version: binaryVersion,
});
