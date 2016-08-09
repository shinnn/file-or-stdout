# file-or-stdout

[![NPM version](https://img.shields.io/npm/v/file-or-stdout.svg)](https://www.npmjs.com/package/file-or-stdout)
[![Build Status](https://travis-ci.org/shinnn/file-or-stdout.svg?branch=master)](https://travis-ci.org/shinnn/file-or-stdout)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/file-or-stdout.svg)](https://coveralls.io/github/shinnn/file-or-stdout?branch=master)
[![dependencies Status](https://david-dm.org/shinnn/file-or-stdout/status.svg)](https://david-dm.org/shinnn/file-or-stdout)
[![devDependencies Status](https://david-dm.org/shinnn/file-or-stdout/dev-status.svg)](https://david-dm.org/shinnn/file-or-stdout?type=dev)

Write data to the file, or print data on stdout if no files are specified

```javascript
const fs = require('fs');
const fileOrStdout = require('file-or-stdout');

fileOrStdout('path/to/a/file', 'Hi').then(() => {
  fs.readFileSync('path/to/a/file', 'utf8'); //=> 'Hi'
});

fileOrStdout(null, 'Hi'); //=> print 'Hi' on stdout
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install file-or-stdout
```

## API

```javascript
const fileOrStdout = require('file-or-stdout');
```

### fileOrStdout(*filePath*, *data* [, *options*])

*filePath*: `String` or a falsy value  
*data*: `String` or [`Buffer`](https://nodejs.org/api/buffer.html#buffer_class_buffer)  
*options*: `Object` or `String` ([`fs.writeFile`](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback) options)  
Return: [`Promise`](https://promisesaplus.com/)

When the first argument is a file path, it writes data on a file creating its ancestor directories if needed. The returned promise will be resolved with `true`.

When the first argument is a falsy value, it prints data on a [stdout](http://www.linfo.org/standard_output.html). The returned promise will be resolved with `false`.

```javascript
fileOrStdout('file.txt', 'data').then(isFileWritten => {
  fs.readFileSync('file.txt', 'utf8'); //=> 'data'
  isFileWritten; //=> true
});

fileOrStdout('', 'data').then(isFileWritten => {
  isFileWritten; //=> false
});
```

## License

Copyright (c) 2016 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
