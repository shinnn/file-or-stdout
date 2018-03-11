'use strict';

const inspectWithKind = require('inspect-with-kind');
const outputFile = require('output-file');

module.exports = function fileOrStdout(filePath, data, options) {
	return new Promise((resolve, reject) => {
		if (!Buffer.isBuffer(data) && typeof data !== 'string' && !(data instanceof Uint8Array)) {
			reject(new TypeError(`Expected data (<string|Buffer|Uint8Array>) to be written to ${
				filePath || 'stdout'
			}, but got ${
				inspectWithKind(data)
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
