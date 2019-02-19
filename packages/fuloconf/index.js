const { entrypoint } = require("@yamadayuki/ogh");

const hook = (args, config) => {
  console.log("hello world");
};

entrypoint("fuloconf", { scriptPath: "index.js", hooks: ["pre-commit"] })
  .registerPerformHook(hook)
  .parse(process.argv);
