#! /usr/bin/env node

import { Cli } from "clipanion";
import cosmiconfig from "cosmiconfig";
import { DefaultCommand } from "./commands/DefaultCommand";
import { HelpCommand } from "./commands/HelpCommand";
import { InstallCommand } from "./commands/InstallCommand";
import { PreCommitCommand } from "./commands/PreCommitCommand";
import { UninstallCommand } from "./commands/UninstallCommand";
import { FrolintConfig, FrolintContext } from "./Context";
import { VersionCommand } from "./commands/VersionCommand";
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
cli.register(VersionCommand);

const result = cosmiconfig(binaryName).searchSync();

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
  version: pkg.version,
});
