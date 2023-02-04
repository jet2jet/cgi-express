import { Socket } from 'net';

import Request from './wrapper/Request/index.js';
import Response from './wrapper/Response/index.js';

// @internal
export function readEnv(
	env: Record<string, string | undefined>,
	varName: string
): string | undefined {
	const uc = varName.toUpperCase();
	const lc = varName.toLowerCase();
	if (uc in env) {
		return env[uc];
	} else if (lc in env) {
		return env[lc];
	}
	return undefined;
}

/**
 * Hooks stdout write methods and returns new stdout object to be used for sending response.
 * This method enables to use 'console.log' just for logging, not for response.
 * @param stdout original stdout
 * @param stderr original stderr
 * @returns New stdout object
 * @internal
 */
export function hookStdout(
	stdout: NodeJS.WriteStream,
	stderr: NodeJS.WriteStream
): NodeJS.WritableStream {
	const write = stdout.write.bind(stdout);
	const end = stdout.end.bind(stdout);
	// overwrite 'write' to redirect console.log to stderr
	stdout.write = stderr.write.bind(stderr);
	stdout.end = stderr.end.bind(stderr);
	return Object.assign(Object.create(Socket.prototype), {
		...stdout,
		write,
		end,
	});
}

export function hookExpressjsRequest(
	// eslint-disable-next-line @typescript-eslint/ban-types
	app: { request?: object }
): void {
	if (!app.request) {
		return;
	}
	Object.setPrototypeOf(
		Request.prototype,
		Object.getPrototypeOf(app.request)
	);
	// overwrite app.request / app.response to prevent from rewriting prototypes
	app.request = Object.create(Request.prototype, {
		app: {
			configurable: true,
			enumerable: true,
			writable: true,
			value: app,
		},
	});
}

export function hookExpressjsResponse(
	// eslint-disable-next-line @typescript-eslint/ban-types
	app: { response?: object }
): void {
	if (!app.response) {
		return;
	}
	Object.setPrototypeOf(
		Response.prototype,
		Object.getPrototypeOf(app.response)
	);
	// overwrite app.request / app.response to prevent from rewriting prototypes
	app.response = Object.create(Response.prototype, {
		app: {
			configurable: true,
			enumerable: true,
			writable: true,
			value: app,
		},
	});
}
