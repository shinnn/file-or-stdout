'use strict';

var util = require('util');

var outputFile = require('output-file');
var PinkiePromise = require('pinkie-promise');

module.exports = function fileOrStdout(filePath, data, options) {
  return new PinkiePromise(function(resolve, reject) {
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

    outputFile(filePath, data, options, function(err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(true);
    });
  });
};
