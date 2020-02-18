#!/usr/bin/env node

const argv = require('yargs').argv;
const fs = require('fs-extra');
const path = require('path');
const R = require('ramda');

const file = argv.file;
const limit = argv.limit;
const debug = process.env.DEBUG;

if (!file || !limit) {
  console.log(
    'usage: check-file-size --file packages/titan-nodedaemon/titan-nodedaemon --limit 80'
  );
  process.exit(1);
}

const limitInBytes = limit * Math.pow(1024, 2);

const getAbsolutePath = filePath => path.resolve(__dirname, '..', filePath);
const getSize = R.prop('size');
const throwIfToBig = size => {
  if (size < limitInBytes) {
    console.log(
      `Size valid for ${file} with ${size} and limit ${limitInBytes}`
    );
  } else {
    throw new Error(
      `Size invalid for ${file}! Received ${size} bytes, allowed ${limitInBytes} bytes`
    );
  }
};

Promise.resolve(file)
  .then(getAbsolutePath)
  .then(fs.stat)
  .then(getSize)
  .then(throwIfToBig)
  .catch(e => {
    console.log(debug ? e : e.message);
    process.exit(1);
  });
