const path = require('path');
const fs = require('fs');

const modifyPackageJson = (packageModifier) => {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');

  const package = fs.readFileSync(packageJsonPath, { encoding: 'utf8' });
  const parsed = JSON.parse(package);
  const modified = packageModifier(parsed);
  const stringified = JSON.stringify(modified, null, 2) + '\n';

  fs.writeFileSync(packageJsonPath, stringified);

  return parsed;
};

module.exports = { modifyPackageJson };
