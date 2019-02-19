const ogh = require("@yamadayuki/ogh");
const { preCommitHook } = require("./preCommitHook");

ogh
  .entrypoint("fuloconf", { scriptPath: "index.js", hooks: ["pre-commit"] })
  .registerPerformHook(preCommitHook)
  .parse(process.argv);
