#!/usr/bin/env node
const argv = require('yargs').argv;
const modifyPackageJson = require('../package-utils').modifyPackageJson;

const types = argv.to;

const parsed = modifyPackageJson(packageJson => {
  packageJson.types = types;
  return packageJson;
});

console.log(`Updated types of ${parsed.name} to ${types}`);
