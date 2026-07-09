#!/usr/bin/env node
/* eslint-disable */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

// 色の定義
const colors = {
  green: "\x1b[0;32m",
  blue: "\x1b[0;34m",
  yellow: "\x1b[1;33m",
  red: "\x1b[0;31m",
  reset: "\x1b[0m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// プロジェクトルートを取得
const projectRoot = path.resolve(__dirname, "..");

// バックアップファイルの管理
let backupFile = null;

// クリーンアップ処理
function cleanup() {
  if (backupFile && fs.existsSync(backupFile)) {
    log("Restoring package.json...", "yellow");
    const originalFile = backupFile.replace(".bak", "");
    fs.renameSync(backupFile, originalFile);
    backupFile = null;
  }
}

// シグナルハンドラーの設定
process.on("exit", cleanup);
process.on("SIGINT", () => {
  cleanup();
  process.exit(130);
});
process.on("SIGTERM", () => {
  cleanup();
  process.exit(143);
});

// パッケージリストを取得
function getPackageList() {
  const packagesDir = path.join(projectRoot, "packages");
  const packages = [];

  if (!fs.existsSync(packagesDir)) {
    throw new Error(`Packages directory not found: ${packagesDir}`);
  }

  const entries = fs.readdirSync(packagesDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const packageJsonPath = path.join(packagesDir, entry.name, "package.json");
    if (!fs.existsSync(packageJsonPath)) continue;

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const packageName = packageJson.name;

    if (packageName) {
      packages.push({
        dirName: entry.name,
        packageName: packageName,
      });
    }
  }

  return packages.sort((a, b) => a.packageName.localeCompare(b.packageName));
}

// パッケージを処理 (link または unlink)
async function processPackage(action, packageInfo) {
  const packageDir = path.join(projectRoot, "packages", packageInfo.dirName);
  const packageJsonPath = path.join(packageDir, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`Package not found: ${packageInfo.dirName}`);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const currentName = packageJson.name;

  log(`\n=== Processing: ${currentName} ===`, "blue");
  console.log("");

  try {
    // actionに応じて処理を実行
    if (action === "link") {
      // ビルド
      log("Building package...", "blue");
      try {
        execSync("yarn build", {
          cwd: packageDir,
          stdio: "inherit",
        });
      } catch (error) {
        throw new Error("ビルドに失敗しました。上記のエラーメッセージを確認してください");
      }
      console.log("");

      // yarn link
      log("Running yarn link...", "blue");
      try {
        execSync("yarn link", {
          cwd: packageDir,
          stdio: "inherit",
        });
      } catch (error) {
        throw new Error("yarn link に失敗しました。上記のエラーメッセージを確認してください");
      }
      console.log("");
    } else {
      // yarn unlink
      log("Running yarn unlink...", "blue");
      try {
        execSync("yarn unlink", {
          cwd: packageDir,
          stdio: "inherit",
        });
      } catch (error) {
        throw new Error("yarn unlink に失敗しました。上記のエラーメッセージを確認してください");
      }
      console.log("");
    }

    // 成功メッセージ
    if (action === "link") {
      log(`✓ Successfully linked ${currentName}`, "green");
      console.log("");
      console.log("You can now use this package in other projects with:");
      log(`yarn link ${currentName}`, "yellow");
    } else {
      log(`✓ Successfully unlinked ${currentName}`, "green");
    }
  } catch (error) {
    // エラー時は必ずクリーンアップ
    cleanup();
    throw error;
  }
}

// インタラクティブな選択
async function selectPackage(packages, action) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const prompt = action === "link" ? "Select a package to link:" : "Select a package to unlink:";
    console.log(prompt);
    console.log("");

    packages.forEach((pkg, index) => {
      console.log(`  ${index + 1}) ${pkg.packageName}`);
    });
    console.log("");

    rl.question("Enter number: ", (answer) => {
      rl.close();

      const index = parseInt(answer, 10) - 1;

      if (isNaN(index) || index < 0 || index >= packages.length) {
        reject(new Error("Invalid selection"));
        return;
      }

      resolve(packages[index]);
    });
  });
}

// 使い方を表示
function usage() {
  console.log(`Usage: node ${path.basename(__filename)} <command>

Commands:
  link     Link a package for local development
  unlink   Unlink a previously linked package

An interactive menu will be shown to select a package.

Examples:
  node ${path.basename(__filename)} link
  node ${path.basename(__filename)} unlink
  yarn link
  yarn unlink
`);
  process.exit(1);
}

// メイン処理
async function main() {
  const action = process.argv[2];

  // actionのバリデーション
  if (!action) {
    usage();
  }

  if (!["link", "unlink"].includes(action)) {
    log(`Error: Invalid command '${action}'`, "red");
    console.log("");
    usage();
  }

  try {
    // タイトル表示
    const title = action === "link" ? "=== Link Package Script ===" : "=== Unlink Package Script ===";
    log(title, "blue");
    console.log("");

    // パッケージリストを取得
    const packages = getPackageList();

    if (packages.length === 0) {
      throw new Error("No packages found");
    }

    // インタラクティブに選択
    const selectedPackage = await selectPackage(packages, action);

    // パッケージを処理
    await processPackage(action, selectedPackage);
  } catch (error) {
    log(`\nError: ${error.message}`, "red");
    process.exit(1);
  }
}

// エラーハンドリング
process.on("unhandledRejection", (error) => {
  log(`\nUnhandled error: ${error.message}`, "red");
  cleanup();
  process.exit(1);
});

void main();
