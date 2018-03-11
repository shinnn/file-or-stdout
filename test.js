'use strong';

const fileOrStdout = require('.');
const interceptStdout = require('intercept-stdout');
const readRemoveFile = require('read-remove-file');
const rmfr = require('rmfr');
const {test} = require('tape');

test('fileOrStdout', async t => {
	t.plan(7);

	const stdouts = [];
	const unhookStdoutInterception = interceptStdout(str => {
		stdouts.push(str);
		return '';
	});

	(async () => {
		const isFile = await fileOrStdout(null, 'Hello');
		unhookStdoutInterception();

		t.equal(isFile, false, 'should be resolve with `false` when it doesn\'t write a file.');
		t.equal(stdouts.join(), 'Hello', 'should print data to stdout when no files are specified.');
	})();

	(async () => {
		const isFile = await fileOrStdout('__this/is/a/path/to/the/temp/file__', new Uint8Array([72, 105]));
		t.equal(isFile, true, 'should be resolve with `true` when it writes a file.');
		t.equal(
			await readRemoveFile('__this/is/a/path/to/the/temp/file__', 'utf8'),
			'Hi',
			'should wrote data to a file when a file path is specified.'
		);
		await rmfr('__this');
	})();

	const fail = t.fail.bind(t, 'Unexpectedly succeeded.');

	try {
		await fileOrStdout();
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected data (<string|Buffer|Uint8Array>) to be written to stdout, but got undefined.',
			'should fail when it takes no arguments.'
		);
	}

	try {
		await fileOrStdout('/a', ['b']);
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected data (<string|Buffer|Uint8Array>) to be written to /a, but got [ \'b\' ] (array).',
			'should fail when the second argument is neither string nor buffer.'
		);
	}

	try {
		await fileOrStdout(__dirname, '');
		fail();
	} catch ({code}) {
		t.equal(code, 'EISDIR', 'should fail when it cannot write a file.');
	}
});
