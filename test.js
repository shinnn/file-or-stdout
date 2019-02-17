'use strict';

const {join} = require('path');
const {pathToFileURL} = require('url');
const {readFile} = require('fs').promises;

const interceptStdout = require('intercept-stdout');
const rmfr = require('rmfr');
const test = require('tape');

test('fileOrStdout()', async t => {
	const stdouts = [];
	const unhookStdoutInterception = interceptStdout(str => {
		stdouts.push(str);
		return '';
	});
	const fileOrStdout = require('.');
	const isFile = await fileOrStdout(null, 'Hello');
	unhookStdoutInterception();

	t.equal(isFile, false, 'should be resolve with `false` when it doesn\'t write a file.');
	t.equal(stdouts.join(), 'Hello', 'should print data to stdout when no files are specified.');

	const tmp = join(__dirname, '__this', 'is', 'a', 'path', 'to', 'the', 'temp', 'file__');

	t.equal(
		await fileOrStdout(tmp, new Uint8Array([72, 105])),
		true,
		'should be resolve with `true` when it writes a file.'
	);

	t.equal(
		await readFile(tmp, 'utf8'),
		'Hi',
		'should wrote data to a file when a file path is specified.'
	);

	await rmfr(join(__dirname, '__this'));

	t.end();
});

test('Argument validation', async t => {
	const fileOrStdout = require('.');
	const fail = t.fail.bind(t, 'Unexpectedly succeeded.');

	try {
		await fileOrStdout(Buffer.from('/a'), ['b']);
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected data (<string|Buffer|Uint8Array>) to be written to /a, but got [ \'b\' ] (array).',
			'should fail when the data is neither string, Buffer nor Uint8Array.'
		);
	}

	try {
		await fileOrStdout(null, new Uint16Array());
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected data (<string|Buffer|Uint8Array>) to be written to stdout, but got Uint16Array [].',
			'should fail when the data is ArrayBuffer but not Uint8Array.'
		);
	}

	try {
		await fileOrStdout(pathToFileURL(__dirname), '');
		fail();
	} catch ({code}) {
		t.equal(code, 'EISDIR', 'should fail when it cannot write a file.');
	}

	try {
		await fileOrStdout();
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'RangeError: Expected 2 or 3 arguments (<any>, <string|Buffer|Uint8Array>[, <Object|string>]), but got no arguments.',
			'should fail when it takes no arguments.'
		);
	}

	try {
		await fileOrStdout('_', '_', '_', '_');
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'RangeError: Expected 2 or 3 arguments (<any>, <string|Buffer|Uint8Array>[, <Object|string>]), but got 4 arguments.',
			'should fail when it takes too many arguments.'
		);
	}

	t.end();
});
