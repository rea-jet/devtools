#!/usr/bin/env node
const argv = require('yargs').argv;
const fs = require('fs');
const pathN = require('path');
const {
  nth,
  flatten,
  pipe,
  map,
  filter,
  curry,
  path,
  isNil,
  complement,
  reduce,
  set,
  lensPath,
  over
} = require('ramda');

const {
  getRootDir,
  getPackageDirs,
  expandDirWhenNeeded,
  expandDir,
  addPackageJson
} = require('./helper');

const package = argv.name;
const rootDir = getRootDir();

const extractVersionOf = curry((package, pkgUri) => {
  const pkg = require(pathN.join(rootDir, pkgUri));

  return [
    path(['name'], pkg),
    path(['dependencies', package], pkg),
    path(['devDependencies', package], pkg)
  ];
});

const addEntry = curry((name, list) => [...(list || []), name]);

const setVersion = curry((prodOrDev, pkgName, version, db) => {
  return version
    ? over(lensPath([version, prodOrDev]), addEntry(pkgName), db)
    : db;
});

const buildDatabase = (acc, [pkgName, prodVersion, devVersion]) =>
  pipe(
    setVersion('prod', pkgName, prodVersion),
    setVersion('dev', pkgName, devVersion)
  )(acc);

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
