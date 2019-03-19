const execa = require("execa");
const mock = require("mock-fs");
const { getStagedFiles, getUnstagedFiles, getAllFiles } = require("../git");

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
          stdout: args.slice(1).includes("*.ts") ? "./bar.ts\n./baz.js\n./foo.js\n" : "./baz.js\n./foo.js\n",
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

      expect(execa.shellSync).toHaveBeenCalledWith("git diff --cached --name-only --diff-filter=ACMRTUB", { cwd: "/" });
    });

    it("should return only staged files", () => {
      mockGit();
      expect(getStagedFiles(cwd)).toEqual(["./foo.js"]);
    });
  });

  describe("getUnstagedFiles", () => {
    const cwd = "/";

    it("calls `git diff ...`", () => {
      mockGit();
      getUnstagedFiles(cwd);

      expect(execa.shellSync).toHaveBeenCalledWith("git diff --name-only --diff-filter=ACMRTUB", { cwd: "/" });
    });

    it("should return only unstaged files", () => {
      mockGit();
      expect(getUnstagedFiles(cwd)).toEqual(["./bar.ts", "./baz.js"]);
    });
  });

  describe("getAllFiles", () => {
    const cwd = "/";

    it("calls `git ls-files ...`", () => {
      mockGit();
      getAllFiles(cwd, [".js", ".jsx"]);

      expect(execa.shellSync).toHaveBeenCalledWith("git ls-files *.js *.jsx", { cwd: "/" });
    });

    it("should return only js files", () => {
      mockGit();
      expect(getAllFiles(cwd, [".js", ".jsx"])).toEqual(["./baz.js", "./foo.js"]);
    });

    it("should return only js files", () => {
      mockGit();
      expect(getAllFiles(cwd, [".js", ".jsx", ".ts", ".tsx"])).toEqual(["./bar.ts", "./baz.js", "./foo.js"]);
    });
  });
});
