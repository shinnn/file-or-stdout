'use strong';

const fileOrStdout = require('.');
const interceptStdout = require('intercept-stdout');
const readRemoveFile = require('read-remove-file');
const rmfr = require('rmfr');
const {test} = require('tape');

test('fileOrStdout', t => {
  t.plan(7);

  const stdouts = [];
  const unhookStdoutInterception = interceptStdout(str => {
    stdouts.push(str);
    return '';
  });

  fileOrStdout(null, 'Hello').then(isFile => {
    unhookStdoutInterception();

    t.strictEqual(isFile, false, 'should be resolve with `false` when it doesn\'t write a file.');
    t.strictEqual(stdouts.join(), 'Hello', 'should print data to stdout when no files are specified.');
  }).catch(t.fail);

  fileOrStdout('__this/is/a/path/to/the/temporary/file__', 'Hi').then(isFile => {
    t.strictEqual(isFile, true, 'should be resolve with `true` when it writes a file.');
    return readRemoveFile('__this/is/a/path/to/the/temporary/file__', 'utf8');
  }).then(data => {
    t.strictEqual(data, 'Hi', 'should wrote data to a file when a file path is specified.');
    rmfr('__this');
  }).catch(t.fail);

  fileOrStdout().then(t.fail, err => {
    t.strictEqual(
      err.message,
      'undefined is neither buffer nor string. Expected data to be printed on stdout.',
      'should fail when it takes no arguments.'
    );
  }).catch(t.fail);

  fileOrStdout('/a', ['b', 'c']).then(t.fail, err => {
    t.strictEqual(
      err.message,
      '[ \'b\', \'c\' ] is neither buffer nor string. Expected data to be written on /a.',
      'should fail when the second argument is neither string nor buffer.'
    );
  }).catch(t.fail);

  fileOrStdout(__dirname, '').then(t.fail, err => {
    t.strictEqual(err.code, 'EISDIR', 'should fail when it cannot write a file.');
  }).catch(t.fail);
});
