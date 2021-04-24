import type * as http from 'http';
import type { Socket } from 'net';

import getMethod from './getMethod';
import getPathInfo from './getPathInfo';
import getQueryString from './getQueryString';
import parseHttpVersion from './parseHttpVersion';

// @internal
export default class Request implements http.IncomingMessage {
	public aborted: boolean;
	public httpVersion: string;
	public httpVersionMajor: number;
	public httpVersionMinor: number;
	public headers: http.IncomingHttpHeaders;
	public rawHeaders: string[];
	public trailers: { [key: string]: string | undefined };
	public rawTrailers: string[];
	public method?: string | undefined;
	public url?: string | undefined;
	public statusCode?: number | undefined;
	public statusMessage?: string | undefined;

	constructor(
		private readonly stdin: NodeJS.ReadStream,
		env: Record<string, string | undefined>
	) {
		this.aborted = false;

		[this.httpVersionMajor, this.httpVersionMinor] = parseHttpVersion(env);
		this.httpVersion = `${this.httpVersionMajor}.${this.httpVersionMinor}`;

		this.headers = {};
		this.rawHeaders = [];
		for (const name in env) {
			const val = env[name];
			if (val === undefined) {
				continue;
			}
			const ra = /^HTTP_(.+)$/i.exec(name);
			if (ra) {
				const lcName = ra[1].toLowerCase().replace(/_/g, '-');
				this.headers[lcName] = val;
				this.rawHeaders.push(`${lcName}: ${val}`);
			}
		}

		this.trailers = {};
		this.rawTrailers = [];

		this.method = getMethod(env);
		const path = getPathInfo(env);
		const qs = getQueryString(env);
		this.url = `${path !== undefined && path !== '' ? path : '/'}${
			qs !== undefined ? '?' + qs : ''
		}`;
	}

	public get connection(): Socket {
		throw new Error('connection is not usable');
	}
	public get socket(): Socket {
		// return 'fake' socket
		return null as any;
	}

	public get readable(): boolean {
		return this.stdin.readable && this.stdin.readableLength > 0;
	}
	public get readableFlowing(): boolean | null {
		return this.stdin.readableFlowing;
	}
	public get readableHighWaterMark(): number {
		return this.stdin.readableHighWaterMark;
	}
	public get readableLength(): number {
		return this.stdin.readableLength;
	}
	public get complete(): boolean {
		return this.stdin.readableLength === 0;
	}

	public setTimeout(_msecs: number, _callback?: () => void): this {
		throw new Error('Method not implemented.');
	}
	public destroy(error?: Error): void {
		this.stdin.destroy(error);
	}
	// @internal
	public _read(size: number): void {
		this.stdin._read(size);
	}
	public read(size?: number): unknown {
		return this.read(size);
	}
	public setEncoding(encoding: string): this {
		this.stdin.setEncoding(encoding);
		return this;
	}
	public pause(): this {
		this.stdin.pause();
		return this;
	}
	public resume(): this {
		this.stdin.resume();
		return this;
	}
	public isPaused(): boolean {
		return this.stdin.isPaused();
	}
	public unpipe(destination?: NodeJS.WritableStream): this {
		console.error('*** Unpipe here:', this.stdin);
		this.stdin.unpipe(destination);
		return this;
	}
	public unshift(chunk: string): void;
	public unshift(chunk: Buffer): void;
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public unshift(chunk: any): void {
		this.stdin.unshift(chunk);
	}
	public wrap(oldStream: NodeJS.ReadableStream): this {
		this.stdin.wrap(oldStream);
		return this;
	}
	public push(chunk: unknown, encoding?: string): boolean {
		return this.stdin.push(chunk, encoding);
	}
	// @internal
	public _destroy(
		error: Error | null,
		callback: (error: Error | null) => void
	): void {
		this._destroy(error, callback);
	}
	public addListener(event: 'close', listener: () => void): this;
	public addListener(event: 'data', listener: (chunk: any) => void): this;
	public addListener(event: 'end', listener: () => void): this;
	public addListener(event: 'readable', listener: () => void): this;
	public addListener(event: 'error', listener: (err: Error) => void): this;
	public addListener(
		event: string | symbol,
		listener: (...args: any[]) => void
	): this;
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public addListener(event: any, listener: any): this {
		this.stdin.addListener(event, listener);
		return this;
	}
	public emit(event: 'close'): boolean;
	public emit(event: 'data', chunk: unknown): boolean;
	public emit(event: 'end'): boolean;
	public emit(event: 'readable'): boolean;
	public emit(event: 'error', err: Error): boolean;
	public emit(event: string | symbol, ...args: any[]): boolean;
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public emit(event: any, ...args: any[]): boolean {
		return this.stdin.emit(event, ...args);
	}
	public on(event: 'close', listener: () => void): this;
	public on(event: 'data', listener: (chunk: any) => void): this;
	public on(event: 'end', listener: () => void): this;
	public on(event: 'readable', listener: () => void): this;
	public on(event: 'error', listener: (err: Error) => void): this;
	public on(event: string | symbol, listener: (...args: any[]) => void): this;
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public on(event: any, listener: any): this {
		this.stdin.on(event, listener);
		return this;
	}
	public once(event: 'close', listener: () => void): this;
	public once(event: 'data', listener: (chunk: any) => void): this;
	public once(event: 'end', listener: () => void): this;
	public once(event: 'readable', listener: () => void): this;
	public once(event: 'error', listener: (err: Error) => void): this;
	public once(
		event: string | symbol,
		listener: (...args: any[]) => void
	): this;
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public once(event: any, listener: any): this {
		this.stdin.once(event, listener);
		return this;
	}
	public prependListener(event: 'close', listener: () => void): this;
	public prependListener(event: 'data', listener: (chunk: any) => void): this;
	public prependListener(event: 'end', listener: () => void): this;
	public prependListener(event: 'readable', listener: () => void): this;
	public prependListener(
		event: 'error',
		listener: (err: Error) => void
	): this;
	public prependListener(
		event: string | symbol,
		listener: (...args: any[]) => void
	): this;
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public prependListener(event: any, listener: any): this {
		this.stdin.prependListener(event, listener);
		return this;
	}
	public prependOnceListener(event: 'close', listener: () => void): this;
	public prependOnceListener(
		event: 'data',
		listener: (chunk: any) => void
	): this;
	public prependOnceListener(event: 'end', listener: () => void): this;
	public prependOnceListener(event: 'readable', listener: () => void): this;
	public prependOnceListener(
		event: 'error',
		listener: (err: Error) => void
	): this;
	public prependOnceListener(
		event: string | symbol,
		listener: (...args: any[]) => void
	): this;
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public prependOnceListener(event: any, listener: any): this {
		this.stdin.prependOnceListener(event, listener);
		return this;
	}
	public removeListener(event: 'close', listener: () => void): this;
	public removeListener(event: 'data', listener: (chunk: any) => void): this;
	public removeListener(event: 'end', listener: () => void): this;
	public removeListener(event: 'readable', listener: () => void): this;
	public removeListener(event: 'error', listener: (err: Error) => void): this;
	public removeListener(
		event: string | symbol,
		listener: (...args: any[]) => void
	): this;
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public removeListener(event: any, listener: any): this {
		this.stdin.removeListener(event, listener);
		return this;
	}
	public [Symbol.asyncIterator](): AsyncIterableIterator<any> {
		return this.stdin[Symbol.asyncIterator]();
	}
	public pipe<T extends NodeJS.WritableStream>(
		destination: T,
		options?: { end?: boolean | undefined }
	): T {
		return this.stdin.pipe(destination, options);
	}
	public off(
		event: string | symbol,
		listener: (...args: any[]) => void
	): this {
		this.stdin.off(event, listener);
		return this;
	}
	public removeAllListeners(event?: string | symbol): this {
		this.stdin.removeAllListeners(event);
		return this;
	}
	public setMaxListeners(n: number): this {
		this.stdin.setMaxListeners(n);
		return this;
	}
	public getMaxListeners(): number {
		return this.stdin.getMaxListeners();
	}
	// eslint-disable-next-line @typescript-eslint/ban-types
	public listeners(event: string | symbol): Function[] {
		return this.stdin.listeners(event);
	}
	// eslint-disable-next-line @typescript-eslint/ban-types
	public rawListeners(event: string | symbol): Function[] {
		return this.stdin.rawListeners(event);
	}
	public listenerCount(type: string | symbol): number {
		return this.stdin.listenerCount(type);
	}
	public eventNames(): Array<string | symbol> {
		return this.stdin.eventNames();
	}
}
