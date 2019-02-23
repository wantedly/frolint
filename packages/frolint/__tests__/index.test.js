const execa = require("execa");
const mock = require("mock-fs");
const { getStagedFiles } = require("../preCommitHook");

// Mocks
jest.mock("execa");

afterEach(() => {
  mock.restore();
  jest.clearAllMocks();
});

const mockGit = () => {
  mock({
    "/.git": {},
    "/foo.js": "foo()",
    "/bar.ts": "bar()",
    "/baz.js": "baz()",
  });

  execa.shellSync.mockImplementation((commandStr, _options) => {
    const [command, ...args] = commandStr.split(" ");

    if (command !== "git") {
      throw new Error(`unnexpected command: ${command}`);
    }

    switch (args[0]) {
      case "diff": {
        return {
          stdout: args[1] === "--cached" ? "./foo.js\n" : "./bar.ts\n./baz.js\n",
        };
      }
      case "ls-files": {
        return {
          stdout: "./bar.ts\n./baz.js\n./foo.js\n",
        };
      }
      default: {
        throw new Error(`unexpected subcommand: ${args[0]}`);
      }
    }
  });
};

describe("preCommitHook", () => {
  describe("getStagedFiles", () => {
    const cwd = "/";

    it("calls `git diff --cached ...`", () => {
      mockGit();
      getStagedFiles(cwd);

      expect(execa.shellSync).toHaveBeenCalledWith("git diff --cached --name-only --diff-filter=ACMRTUB", { cwd });
    });

    it("should return only staged files", () => {
      mockGit();
      expect(getStagedFiles(cwd)).toEqual(["./foo.js"]);
    });
  });
});
