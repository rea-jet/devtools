const fs = require('fs');
const pathN = require('path');
const { map, flatten, pipe, reduce } = require('ramda');

const getRootDir = () => pathN.resolve(process.cwd());

const packageDirsFromLerna = () => {
  return [
    '.', // this catches the package.json of the rootDir project
    ...require(pathN.join(getRootDir(), 'lerna.json')).packages
  ];
};

const expandDir = dir =>
  fs
    .readdirSync(dir)
    .map(file => [file, fs.statSync(pathN.join(dir, file))])
    .filter(([file, stats]) => stats.isDirectory())
    .map(([file, _]) => pathN.join(dir, file));

const expandDirWhenNeeded = dir =>
  !!dir.match(/\*$/) ? expandDir(pathN.dirname(dir)) : dir;

const getPackageDirs = () =>
  pipe(
    map(expandDirWhenNeeded),
    flatten
  )(packageDirsFromLerna());

const addPackageJson = uri => pathN.join(uri, 'package.json');

const pipeM = (...[fst, ...pipeline]) => (...args) =>
  reduce((acc, fn) => acc.then(fn), Promise.resolve(fst(...args)), pipeline);

module.exports = {
  getRootDir,
  getPackageDirs,
  expandDir,
  expandDirWhenNeeded,
  addPackageJson,
  pipeM
};
