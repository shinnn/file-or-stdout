# file-or-stdout

[![npm version](https://img.shields.io/npm/v/file-or-stdout.svg)](https://www.npmjs.com/package/file-or-stdout)
[![Build Status](https://travis-ci.com/shinnn/file-or-stdout.svg?branch=master)](https://travis-ci.com/shinnn/file-or-stdout)
[![codecov](https://codecov.io/gh/shinnn/file-or-stdout/branch/master/graph/badge.svg)](https://codecov.io/gh/shinnn/file-or-stdout)

Write data to a file, or to stdout if no file is specified

```javascript
const {readFile} = require('fs').promises;
const fileOrStdout = require('file-or-stdout');

(async () => {
  await fileOrStdout('path/to/a/file', 'Hi');
  await readFile('path/to/a/file', 'utf8'); //=> 'Hi'
})();

fileOrStdout(null, 'Hi'); // print 'Hi' on stdout
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install file-or-stdout
```

## API

```javascript
const fileOrStdout = require('file-or-stdout');
```

### fileOrStdout(*filePath*, *data* [, *options*])

*filePath*: `string | Buffer | Uint8Array | URL` or a [falsy value](https://developer.mozilla.org/docs/Glossary/Falsy)  
*data*: `string | Buffer | Uint8Array`  
*options*: `Object` ([output-file](https://github.com/shinnn/output-file) [options](https://github.com/shinnn/output-file#options)) or `string` (encoding)  
Return: `Promise<boolean>`

When the first argument is a file path, it writes data to a file after creating its missing ancestor directories. The returned `Promise` will be resolved with `true`.

When the first argument is a falsy value, it writes data to [`process.stdout`](https://nodejs.org/api/process.html#process_process_stdout). The returned `Promise` will be resolved with `false`.

```javascript
(async () => {
  const isFileWritten = await fileOrStdout(new URL('file:///Users/your/file.txt'), 'hello');

  await fs.promises.readFile('/Users/your/file.txt', 'utf8'); //=> 'hello'
  isFileWritten; //=> true
})();

(async () => {
  const isFileWritten = await fileOrStdout('', 'hello');
  isFileWritten; //=> false
})();
```

## Related project

* [file-or-stdin](https://github.com/shinnn/file-or-stdin) — Inverse of this module; read a file, or read stdin if no file is specified

## License

[ISC License](./LICENSE) © 2018 - 2019 Shinnosuke Watanabe
