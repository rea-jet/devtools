const fs = require('fs');
const pathN = require('path');
const {
  map,
  flatten,
  pipe,
  reduce,
  curry,
  path,
  over,
  lensPath
} = require('ramda');

const getRootDir = () => pathN.resolve(process.cwd());

const addEntry = curry((name, list) => [...(list || []), name]);

const packageDirsFromLerna = () => {
  return [
    '.', // this catches the package.json of the rootDir project
    ...require(pathN.join(getRootDir(), 'lerna.json')).packages
  ];
};

const expandDir = dir =>
  fs
    .readdirSync(pathN.resolve(getRootDir(), dir))
    .map(file => [file, fs.statSync(pathN.join(getRootDir(), dir, file))])
    .filter(([file, stats]) => stats.isDirectory())
    .map(([file, _]) => pathN.join(dir, file));

const expandDirWhenNeeded = dir => {
  return !!dir.match(/\*$/) ? expandDir(pathN.dirname(dir)) : dir;
};
const getPackageDirs = () =>
  pipe(
    map(expandDirWhenNeeded),
    flatten
  )(packageDirsFromLerna());

const addPackageJson = uri => pathN.join(getRootDir(), uri, 'package.json');

const pipeM = (...[fst, ...pipeline]) => (...args) =>
  reduce((acc, fn) => acc.then(fn), Promise.resolve(fst(...args)), pipeline);

const extractVersionOf = curry((package, pkgUri) => {
  const pkg = require(pathN.join(pkgUri));

  return [
    path(['name'], pkg),
    path(['dependencies', package], pkg),
    path(['devDependencies', package], pkg)
  ];
});

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

module.exports = {
  getRootDir,
  getPackageDirs,
  expandDir,
  expandDirWhenNeeded,
  addPackageJson,
  pipeM,
  extractVersionOf,
  buildDatabase
};
