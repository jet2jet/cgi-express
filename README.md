# cgi-express

\[EXPERIMENTAL\] Executes Express.js application as CGI program.

## Usage

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

## License

[MIT License](./LICENSE)
