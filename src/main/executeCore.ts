import type * as express from 'express';

import type Options from './Options';

import { hookExpressjsRequest, hookExpressjsResponse } from './utils';
import Request from './wrapper/Request';
import Response from './wrapper/Response';

/* eslint-disable @typescript-eslint/ban-types */
declare module 'express' {
	interface Application {
		request?: object;
		response?: object;
	}
}
/* eslint-enable @typescript-eslint/ban-types */

export default function executeCore(
	app: express.Application,
	opts: Options & Required<Pick<Options, 'stdin' | 'stdout' | 'env'>>
): Promise<void> {
	return new Promise((resolve) => {
		// overwrite app.request / app.response to prevent from rewriting prototypes
		hookExpressjsRequest(app);
		hookExpressjsResponse(app);

		const req = new Request(opts.stdin, opts.env);
		const res = new Response(req, opts.stdout, resolve);
		app(req, res);
	});
}
