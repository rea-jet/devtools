#!/usr/bin/env node
const argv = require('yargs').argv;
const {
  nth,
  flatten,
  pipe,
  map,
  filter,
  curry,
  path,
  isNil,
  complement
} = require('ramda');
const pathN = require('path');
const fs = require('fs');

const {
  getRootDir,
  getPackageDirs,
  expandDirWhenNeeded,
  expandDir,
  addPackageJson
} = require('./helper');

const notNil = complement(isNil);

const rootDir = getRootDir();
const package = argv.name;
const version = argv.to;

const hasPath = curry((keyPath, pkgJson) =>
  pipe(
    path(keyPath),
    notNil
  )(pkgJson)
);

const hasDependencyEntry = (name, json) =>
  hasPath(['dependencies', name], json);
const hasDevDependencyEntry = (name, json) =>
  hasPath(['devDependencies', name], json);

const hasDependency = curry((name, packageUri) => {
  const pkgJson = require(pathN.join(rootDir, packageUri));
  return (
    hasDependencyEntry(name, pkgJson) || hasDevDependencyEntry(name, pkgJson)
  );
});

const setPackageVersion = curry((name, version, packageUri) => {
  const fullUri = pathN.join(rootDir, packageUri);
  const pkgJson = require(fullUri);

  if (hasDependencyEntry(name, pkgJson)) {
    pkgJson.dependencies[name] = version;
  }
  if (hasDevDependencyEntry(name, pkgJson)) {
    pkgJson.devDependencies[name] = version;
  }

  fs.writeFileSync(fullUri, JSON.stringify(pkgJson, null, ' '));
  return packageUri;
});

const result = pipe(
  map(addPackageJson),
  filter(fs.existsSync.bind(fs)),
  filter(hasDependency(package)),
  map(setPackageVersion(package, version))
)(getPackageDirs());

console.log(`Updated ${package} to ${version} in ${result.length} packages`);
