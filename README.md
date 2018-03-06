# file-or-stdout

[![npm version](https://img.shields.io/npm/v/file-or-stdout.svg)](https://www.npmjs.com/package/file-or-stdout)
[![Build Status](https://travis-ci.org/shinnn/file-or-stdout.svg?branch=master)](https://travis-ci.org/shinnn/file-or-stdout)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/file-or-stdout.svg)](https://coveralls.io/github/shinnn/file-or-stdout?branch=master)

Write data to a file, or to stdout if no file is specified

```javascript
const {readFileSync} = require('fs');
const fileOrStdout = require('file-or-stdout');

(async () => {
  await fileOrStdout('path/to/a/file', 'Hi');
  readFileSync('path/to/a/file', 'utf8'); //=> 'Hi'
})();

fileOrStdout(null, 'Hi'); //=> print 'Hi' on stdout
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install file-or-stdout
```

## API

```javascript
const fileOrStdout = require('file-or-stdout');
```

### fileOrStdout(*filePath*, *data* [, *options*])

*filePath*: `string` or a [falsy value](https://developer.mozilla.org/docs/Glossary/Falsy)  
*data*: `string` or [`Buffer`](https://nodejs.org/api/buffer.html#buffer_class_buffer)  
*options*: `Object` or `string` ([`fs.writeFile`](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback) options)  
Return: `Promise<boolean>`

When the first argument is a file path, it writes data to a file after creating its missing ancestor directories. The returned promise will be resolved with `true`.

When the first argument is a falsy value, it writes data to [`process.stdout`](https://nodejs.org/api/process.html#process_process_stdout). The returned promise will be resolved with `false`.

```javascript
(async () => {
  const isFileWritten = await fileOrStdout('file.txt', 'hello');

  fs.readFileSync('file.txt', 'utf8'); //=> 'hello'
  isFileWritten; //=> true
})();

(async () => {
  const isFileWritten = await fileOrStdout('', 'hello');
  isFileWritten; //=> false
})();
```

## License

[ISC License](./LICENSE) © 2018 Shinnosuke Watanabe
