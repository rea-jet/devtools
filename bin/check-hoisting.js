#!/usr/bin/env node
const argv = require('yargs').argv;
const fs = require('fs');
const pathN = require('path');
const { pipe, map, filter, path, reduce } = require('ramda');

const {
  getPackageDirs,
  addPackageJson,
  extractVersionOf,
  buildDatabase
} = require('./helper');

const package = argv.name;

const checkVersionResults = db => {
  const numberOfVersions = Object.keys(db).length;

  if (numberOfVersions === 0) {
    console.log(`No Version for ${package} found in packages.`);
    process.exit(1);
  }

  if (numberOfVersions > 1) {
    console.log(
      `There are ${numberOfVersions} different versions of ${package}:`
    );
    console.log(JSON.stringify(db, null, 2));
    process.exit(1);
  }

  return Object.keys(db)[0];
};

const checkInstalledVersion = version => {
  const packageVersion = require(`${package}/package.json`).version;
  if (packageVersion !== version) {
    console.log(
      `Required version of ${package} is ${version} but found ${packageVersion} installed`
    );
    process.exit(1);
  } else {
    console.log(`All good for ${package}`);
    process.exit(0);
  }
};

pipe(
  map(addPackageJson),
  filter(fs.existsSync.bind(fs)),
  map(extractVersionOf(package)),
  reduce(buildDatabase, {}),
  checkVersionResults,
  checkInstalledVersion
)(getPackageDirs());
