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

const printResult = db => {
  const numberOfVersions = Object.keys(db).length;

  if (numberOfVersions > 1) {
    console.log(
      `There are ${numberOfVersions} different versions of ${package}:`
    );
  } else {
    console.log('All good! :)');
  }
  console.log(JSON.stringify(db, null, 2));
};

pipe(
  map(addPackageJson),
  filter(fs.existsSync.bind(fs)),
  map(extractVersionOf(package)),
  reduce(buildDatabase, {}),
  printResult
)(getPackageDirs());
