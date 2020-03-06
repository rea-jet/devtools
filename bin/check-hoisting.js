#!/usr/bin/env node
const yargs = require('yargs');
const fs = require('fs');
const { pipe, map, filter, reduce, and, sort, head, last } = require('ramda');
const semverCmp = require('semver-compare');

const {
  getPackageDirs,
  addPackageJson,
  extractVersionOf,
  buildDatabase,
  getRootDir
} = require('./helper');

const packages = yargs.array('name').parse().name;

const areVersionsSubversions = db => {
  const isSubversion = ([isValid, subversion], version) => {
    return isValid
      ? [version.indexOf(subversion) === 0, version]
      : [false, version];
  };

  return pipe(
    Object.keys,
    sort(semverCmp),
    reduce(isSubversion, [true, '']),
    head
  )(db);
};

const getConcreteVersion = db =>
  pipe(
    Object.keys,
    sort(semverCmp),
    // use last because it is the most specific version
    // e.g. ['4', '4.1', '4.1.7'] => '4.1.7
    last
  )(db);

const checkVersionResults = package => db => {
  const numberOfVersions = Object.keys(db).length;

  if (numberOfVersions === 0) {
    console.log(`No Version for ${package} found in packages.`);
    return false;
  }

  if (numberOfVersions > 1 && !areVersionsSubversions(db)) {
    console.log(
      `There are ${numberOfVersions} different versions of ${package}:`
    );
    console.log(JSON.stringify(db, null, 2));
    return false;
  }

  return getConcreteVersion(db);
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
