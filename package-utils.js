#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const modifyPackageJson = packageModifier => {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');

  const package = fs.readFileSync(packageJsonPath);
  const parsed = JSON.parse(package);
  const modified = packageModifier(parsed);
  let stringified = JSON.stringify(modified, null, 2);

  //add new line at the end
  stringified += '\n';

  fs.writeFileSync(packageJsonPath, stringified);

  return parsed;
};

module.exports = { modifyPackageJson };
