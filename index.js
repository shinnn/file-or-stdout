'use strict';

const {promisify} = require('util');
const {isUint8Array} = require('util').types;

const inspectWithKind = require('inspect-with-kind');
const outputFile = require('output-file');

const ARG_ERROR = 'Expected 2 or 3 arguments (<any>, <string|Buffer|Uint8Array>[, <Object|string>])';
const writeStdout = promisify(process.stdout.write.bind(process.stdout));

module.exports = async function fileOrStdout(...args) {
	const argLen = args.length;

	if (argLen === 0) {
		const error = new RangeError(`${ARG_ERROR}, but got no arguments.`);
		error.code = 'ERR_MISSING_ARGS';

		throw error;
	}

	if (argLen !== 2 && argLen !== 3) {
		const error = new RangeError(`${ARG_ERROR}, but got ${argLen} arguments.`);
		error.code = 'ERR_TOO_MANY_ARGS';

		throw error;
	}

	const [filePath, data, options = {}] = args;

	if (!Buffer.isBuffer(data) && typeof data !== 'string' && !isUint8Array(data)) {
		throw new TypeError(`Expected data (<string|Buffer|Uint8Array>) to be written to ${
			filePath || 'stdout'
		}, but got ${inspectWithKind(data)}.`);
	}

	if (filePath) {
		await outputFile(...args);
		return true;
	}

	try {
		await outputFile(__dirname, data, options);
	} catch (err) {
		if (err.code !== 'EISDIR') {
			Error.captureStackTrace(err, module.exports);
			throw err;
		}
	}

	const encoding = typeof options === 'string' ? options : options.encoding;

	if (argLen !== 3 || typeof data !== 'string' || !encoding) {
		await writeStdout(data);
	} else {
		await writeStdout(data, encoding);
	}

	return false;
};
