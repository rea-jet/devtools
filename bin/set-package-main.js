#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const argv = require('yargs').argv;

const newMain = argv.to;
if (!newMain) {
  console.log('Usage: set-package-main --to dist/index.js');
  process.exit(1);
}

const packageJsonPath = path.resolve(process.cwd(), 'package.json');

let package = fs.readFileSync(packageJsonPath);
let parsed = JSON.parse(package);
parsed.main = newMain;
let stringified = JSON.stringify(parsed, null, 2);

//add new line at the end
stringified += '\n';

fs.writeFileSync(packageJsonPath, stringified);

console.log(`Updated main of ${parsed.name} to ${newMain}`);
