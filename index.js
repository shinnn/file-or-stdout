'use strict';

const inspect = require('util').inspect;

const outputFile = require('output-file');

module.exports = function fileOrStdout(filePath, data, options) {
	return new Promise((resolve, reject) => {
		if (!Buffer.isBuffer(data) && typeof data !== 'string') {
			reject(new TypeError(`${
				inspect(data)
			} is neither buffer nor string. Expected data to be ${
				filePath ? `written on ${filePath}` : 'printed on stdout'
			}.`));

			return;
		}

		if (filePath) {
			outputFile(filePath, data, options, err => {
				if (err) {
					reject(err);
					return;
				}

				resolve(true);
			});

			return;
		}

		process.stdout.write(data);
		resolve(false);
	});
};
