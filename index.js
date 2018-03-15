'use strict';

const inspectWithKind = require('inspect-with-kind');
const outputFile = require('output-file');

module.exports = async function fileOrStdout(...args) {
	const argLen = args.length;

	if (argLen !== 2 && argLen !== 3) {
		throw new RangeError(`Expected 2 or 3 arguments (<any>, <string|Buffer|Uint8Array>[, <Object|string>]), but got ${
			argLen === 0 ? 'no' : argLen
		} arguments.`);
	}

	const [filePath, data] = args;

	if (!Buffer.isBuffer(data) && typeof data !== 'string' && !(data instanceof Uint8Array)) {
		throw new TypeError(`Expected data (<string|Buffer|Uint8Array>) to be written to ${
			filePath || 'stdout'
		}, but got ${
			inspectWithKind(data)
		}.`);
	}

	return new Promise((resolve, reject) => {
		if (filePath) {
			outputFile(...args, err => {
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
