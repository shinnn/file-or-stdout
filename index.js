'use strict';

const util = require('util');

const outputFile = require('output-file');

module.exports = function fileOrStdout(filePath, data, options) {
  return new Promise((resolve, reject) => {
    if (!Buffer.isBuffer(data) && typeof data !== 'string') {
      reject(new TypeError(
        util.inspect(data) +
        ' is neither buffer nor string. Expected data to be ' +
        (filePath ? 'written on ' + filePath : 'printed on stdout') +
        '.'
      ));

      return;
    }

    if (!filePath) {
      process.stdout.write(data);
      resolve(false);
      return;
    }

    outputFile(filePath, data, options, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve(true);
    });
  });
};
