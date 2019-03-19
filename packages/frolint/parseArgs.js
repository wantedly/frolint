const { green } = require("chalk");
const arg = require("arg");

function parseArgs(args) {
  const result = arg(
    {
      "--formatter": String,
      "--branch": String,
      "--no-stage": Boolean,
      "--help": Boolean,
      "--no-git": Boolean,
      "-v": "--formatter",
      "-b": "--branch",
      "-h": "--help",
    },
    { argv: args, permissive: true }
  );

  return {
    formatter: result["--formatter"],
    branch: result["--branch"],
    noStage: result["--no-stage"],
    help: result["--help"],
    noGit: result["--no-git"],
  };
}

function printHelp() {
  console.log(`
${green("frolint - FROntend LINT tool integrated into git pre-commit hook")}

Usage:
  frolint [flags]

Available Flags:
  -h, --help        help for frolint
  -f, --formatter   the ESLint formatter to print lint errors and warnings
  -b, --branch      target branch to compare the file diff
      --no-stage    frolint stages the files automatically if auto fixable
                    errors are found. If you set this option as true,
                    frolint does not stage the fixed files
      --no-git      use frolint without git integrations
`);
}

function parseNoGitArgs(args) {
  const result = arg(
    {
      "--formatter": String,
      "--help": Boolean,
      "--files": [String],
      "-v": "--formatter",
      "-h": "--help",
      "-f": "--files",
    },
    { argv: args, permissive: true }
  );

  return {
    formatter: result["--formatter"],
    help: result["--help"],
    files: result["--files"],
    noGit: true,
  };
}

function printNoGitHelp() {
  console.log(`
${green("frolint - FROntend LINT tool")}

Usage:
  frolint [flags]

Available Flags:
  -h, --help        help for frolint
  -f, --formatter   the ESLint formatter to print lint errors and warnings
  -F, --files       pass the files to analyze with ESLint
`);
}

module.exports = {
  printHelp,
  printNoGitHelp,
  parseArgs,
  parseNoGitArgs,
};
