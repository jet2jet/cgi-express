# cgi-express

[![NPM version](https://badge.fury.io/js/cgi-express.svg)](https://www.npmjs.com/package/cgi-express)
[![Build Status](https://api.travis-ci.com/jet2jet/cgi-express.svg?branch=main)](https://www.travis-ci.com/jet2jet/cgi-express)

\[EXPERIMENTAL; Not tested well\] Executes Express.js application as CGI program.

> - Since this library is not tested well, please be HIGHLY CAREFUL with using this in production.
> - This library may be uncompatible with some CGI executors.

## Requirements

- Express.js (tested with 4.x)
  - For TypeScript, `@types/express` is necessary to build
- Node.js >=10

## Example

```js
#!/usr/bin/env node
const express = require('express');
const cgiExpress = require('cgi-express');

const app = express();
// initialize 'app' as usual Express.js application here...

// call 'execute' with the default configuration
// (using process.stdout, process.stdin, and process.env)
cgiExpress.execute(app);
```

## API

### `function execute(app: express.Application, opts?: Options): Promise<void>`

Executes Express.js application as a CGI program. This function uses `process.stdin`,
`process.stdout`, and `process.env` properties as default.

#### Parameters

- `app` -- An Express.js application instance
- `opts` -- Additional options (`Options`) for execution

#### Returns

Promise object which resolves when execution finishes

### `function executeCore(app: express.Application, opts?: Options & Required<Pick<Options, 'stdin' | 'stdout' | 'env'>>): Promise<void>`

Executes Express.js application as a CGI program, with custom stdin/stdout/env data.

#### Parameters

- `app` -- An Express.js application instance
- `opts` -- Additional options (`Options`) for execution (stdin/stdout/env are not omittable)

#### Returns

Promise object which resolves when execution finishes

## License

[MIT License](./LICENSE)
