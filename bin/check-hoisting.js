#!/usr/bin/env node
const yargs = require('yargs');
const fs = require('fs');
const pathN = require('path');
const { pipe, map, filter, path, reduce, and } = require('ramda');

const {
  getPackageDirs,
  addPackageJson,
  extractVersionOf,
  buildDatabase,
  getRootDir
} = require('./helper');

const packages = yargs.array('name').parse().name;

const checkVersionResults = package => db => {
  const numberOfVersions = Object.keys(db).length;

  if (numberOfVersions === 0) {
    console.log(`No Version for ${package} found in packages.`);
    return false;
  }

  if (numberOfVersions > 1) {
    console.log(
      `There are ${numberOfVersions} different versions of ${package}:`
    );
    console.log(JSON.stringify(db, null, 2));
    return false;
  }

  return Object.keys(db)[0];
};

const checkInstalledVersion = package => version => {
  if (!version) {
    return false;
  }

  const packageVersion = require(`${getRootDir()}/node_modules/${package}/package.json`)
    .version;
  if (packageVersion !== version) {
    console.log(
      `Required version of ${package} is ${version} but found ${packageVersion} installed`
    );
    return false;
  } else {
    console.log(`All good for ${package}`);
    return true;
  }
};

const packageTree = pipe(
  map(addPackageJson),
  filter(fs.existsSync.bind(fs))
)(getPackageDirs());

const valid = pipe(
  map(package =>
    pipe(
      map(extractVersionOf(package)),
      reduce(buildDatabase, {}),
      checkVersionResults(package),
      checkInstalledVersion(package)
    )(packageTree)
  ),
  reduce(and, true)
)(packages);

if (valid) {
  process.exit(0);
} else {
  process.exit(1);
}
