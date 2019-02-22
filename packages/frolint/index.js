#!/usr/bin/env node

const ogh = require("@yamadayuki/ogh");
const { hook } = require("./preCommitHook");

ogh
  .entrypoint("frolint", { scriptPath: "index.js", hooks: ["pre-commit"] })
  .registerPerformHook(hook)
  .parse(process.argv);
