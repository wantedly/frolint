const ogh = require("@yamadayuki/ogh");
const { preCommitHook } = require("./preCommitHook");

ogh
  .entrypoint("frolint", { scriptPath: "index.js", hooks: ["pre-commit"] })
  .registerPerformHook(preCommitHook)
  .parse(process.argv);
