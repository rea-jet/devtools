#!/usr/bin/env node
const argv = require('yargs').argv;
const modifyPackageJson = require('../package-utils').modifyPackageJson;

const newMain = argv.to;
if (!newMain) {
  console.log('Usage: set-package-main --to dist/index.js');
  process.exit(1);
}

const parsed = modifyPackageJson(packageJson => {
  packageJson.main = newMain;
  return packageJson;
});

console.log(`Updated main of ${parsed.name} to ${newMain}`);
