import * as http from 'http';

import type Request from '../Request';

// @internal
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
}
