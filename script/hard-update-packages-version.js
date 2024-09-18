// @ts-check

const { execSync } = require("child_process");
const { promises } = require("fs");
const { join } = require("path");

const { manifest } = require("pacote");

function getPackageJsonFiles() {
  return execSync("git ls-files | grep package.json")
    .toString()
    .trim()
    .split("\n")
    .map((s) => s.trim());
}

/**
 * @param {string} pkgJsonFilepath
 */
async function updatePackageJson(pkgJsonFilepath) {
  const pkgJson = require(pkgJsonFilepath);
  if (!pkgJson.dependencies && !pkgJson.devDependencies) {
    return;
  }

  const targetDeps = Object.keys(pkgJson.dependencies || {});
  const targetDevDeps = Object.keys(pkgJson.devDependencies || {});

  const depsPromises = targetDeps.map((packageName) => manifest(packageName));
  const devDepsPromises = targetDevDeps.map((packageName) => manifest(packageName));

  const dependencyManifests = (await Promise.all(depsPromises)).map(({ name, version }) => [name, version]);
  const devDependencyManifests = (await Promise.all(devDepsPromises)).map(({ name, version }) => [name, version]);

  const newPkgJson = JSON.parse(JSON.stringify(pkgJson));

  if (newPkgJson.dependencies) {
    dependencyManifests.forEach(([packageName, version]) => {
      newPkgJson.dependencies[packageName] = `^${version}`;
    });
  }

  if (newPkgJson.devDependencies) {
    devDependencyManifests.forEach(([packageName, version]) => {
      newPkgJson.devDependencies[packageName] = `^${version}`;
    });
  }

  await promises.writeFile(pkgJsonFilepath, `${JSON.stringify(newPkgJson, null, "  ")}\n`, {
    encoding: "utf-8",
    flag: "w",
  });
}

function main() {
  const entries = getPackageJsonFiles();
  entries.forEach(async (entry) => {
    await updatePackageJson(join(__dirname, "..", entry));
  });
}

try {
  main();
} catch (err) {
  console.error(err);

  process.exit(1);
}
