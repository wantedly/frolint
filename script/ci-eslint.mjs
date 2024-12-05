#!/usr/bin/env zx

// @ts-check
import { $, chalk, echo } from "zx";

$.verbose = true;

const BASE_BRANCH = process.env.GITHUB_BASE_REF || "master";

const _baseCommit = await $`git merge-base HEAD origin/${BASE_BRANCH}`;
const baseCommit = _baseCommit.stdout.trimEnd();

try {
  const rawFiles = await $`git diff --name-only --diff-filter=ACMRTUB ${baseCommit} HEAD`;
  const files = rawFiles.stdout.split("\n").filter((line) => line !== "" && line.match(/\.(c|m)?(j|t)sx?$/));

  if (files.length === 0) {
    echo(chalk.green("No ESLint target files found."));
    process.exit(0);
  }

  echo(chalk(`yarn run lint ${files.join(" ")}`));
  await $`yarn run lint ${files}`;
} catch (e) {
  // @ts-ignore
  echo(chalk.red(e.stdout));
  process.exit(1);
}
