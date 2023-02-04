import * as http from 'http';

import type Request from '../Request/index.js';

declare module 'http' {
	interface OutgoingMessage {
		// eslint-disable-next-line @typescript-eslint/method-signature-style
		_storeHeader(firstLine: string, headers: unknown): void;
	}
}

/**
 * 'Response' wrapper class, using Request and stdout (WritableStream)
 */
export default class Response extends http.ServerResponse {
	constructor(
		req: Request,
		stdout: NodeJS.WritableStream,
		private readonly endCallback?: () => void
	) {
		super(req);
		// for stdout, chunk should be disabled by default.
		// (the data should be sent directly)
		this.useChunkedEncodingByDefault = false;
		this.assignSocket(stdout as any);
	}

	// override 'end' method to call 'endCallback' handler

	public end(cb?: () => void): void;
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public end(chunk: any, cb?: () => void): void;
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public end(chunk: any, encoding?: string, cb?: () => void): void;
	public end(...args: any[]): void {
		const endCallback = this.endCallback;
		super.end(...args);
		if (endCallback) {
			endCallback();
		}
	}

	// override '_storeHeader'
	public _storeHeader(firstLine: string, headers: unknown): void {
		// Parse the line such as `HTTP/1.1 200 OK\r\n` and pick up status code and message
		const ra = /^\S+\s+(\d+)(?:\s+(.*))?/.exec(firstLine);
		if (ra != null) {
			// Rewrite to `Status: 200 OK\r\n`
			firstLine = `Status: ${ra[1]}${
				ra[2] != null ? ` ${ra[2]}` : ''
			}\r\n`;
		}
		super._storeHeader(firstLine, headers);
	}
}
