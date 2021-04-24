import { Socket } from 'net';

import Request from './wrapper/Request';
import Response from './wrapper/Response';

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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function hookExpressjsRequest(app: any): void {
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function hookExpressjsResponse(app: any): void {
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
