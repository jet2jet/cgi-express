import { Socket } from 'net';
import { hookStdout, readEnv } from '@/utils.js';

describe('utils', () => {
	describe('readEnv', () => {
		it('should read values with UPPER case and lower case', () => {
			expect(readEnv({ FOO: 'foo', BAR: 'bar' }, 'FOO')).toBe('foo');
			expect(readEnv({ foo: 'foo', BAR: 'bar' }, 'FOO')).toBe('foo');
			expect(readEnv({ FOO: 'foo', BAR: 'bar' }, 'foo')).toBe('foo');
			expect(readEnv({ foo: 'foo', BAR: 'bar' }, 'foo')).toBe('foo');
		});
		it('should return undefined if the variable is not found', () => {
			expect(readEnv({ FOO: 'foo', BAR: 'bar' }, 'BAZ')).toBeUndefined();
		});
	});
	describe('hookStdout', () => {
		it("should overwrite 'write' and 'end' methods", () => {
			const dummyStdout = new Socket();
			const originalStdoutWrite = jest
				.spyOn(dummyStdout, 'write')
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				.mockImplementation(() => {});
			const originalStdoutEnd = jest
				.spyOn(dummyStdout, 'end')
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				.mockImplementation(() => {});
			const dummyStdoutWrite = (dummyStdout.write = jest.fn());
			const dummyStdoutEnd = (dummyStdout.end = jest.fn());
			const dummyStderr = new Socket();
			const originalStderrWrite = jest
				.spyOn(dummyStderr, 'write')
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				.mockImplementation(() => {});
			const originalStderrEnd = jest
				.spyOn(dummyStderr, 'end')
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				.mockImplementation(() => {});
			const newStdout = hookStdout(dummyStdout, dummyStderr);
			expect(dummyStdout.write).not.toBe(originalStdoutWrite);
			expect(dummyStdout.end).not.toBe(originalStdoutEnd);

			dummyStdout.write('');
			dummyStdout.end('');
			expect(dummyStdoutWrite).not.toHaveBeenCalled();
			expect(originalStderrWrite).toHaveBeenCalled();
			expect(originalStdoutWrite).not.toHaveBeenCalled();
			expect(dummyStdoutEnd).not.toHaveBeenCalled();
			expect(originalStderrEnd).toHaveBeenCalled();
			expect(originalStdoutEnd).not.toHaveBeenCalled();

			jest.clearAllMocks();
			newStdout.write('');
			newStdout.end('');
			expect(dummyStdoutWrite).toHaveBeenCalled();
			expect(originalStderrWrite).not.toHaveBeenCalled();
			expect(originalStdoutWrite).not.toHaveBeenCalled();
			expect(dummyStdoutEnd).toHaveBeenCalled();
			expect(originalStderrEnd).not.toHaveBeenCalled();
			expect(originalStdoutEnd).not.toHaveBeenCalled();
		});
	});
	describe.each([
		[
			'hookExpressjsRequest',
			'request',
			async () => (await import('@/wrapper/Request')).default,
		],
		[
			'hookExpressjsResponse',
			'response',
			async () => (await import('@/wrapper/Response')).default,
		],
	] as const)('%s', (hookFunctionName, appFieldName, getConstructor) => {
		let constructor: ReturnType<typeof getConstructor> extends Promise<
			infer C
		>
			? C
			: never;
		let hookFunction: typeof import('@/utils')[typeof hookFunctionName];
		beforeAll(async () => {
			jest.resetModules();
			constructor = await getConstructor();
			// the 'utils' module should be reloaded due to resetting modules
			hookFunction = (await import('@/utils'))[hookFunctionName];
		});
		it(`should rewrite app.${appFieldName}`, () => {
			// eslint-disable-next-line @typescript-eslint/no-extraneous-class
			class DummyClass {}
			const app = {
				[appFieldName]: Object.create(DummyClass.prototype),
			};
			hookFunction(app);
			expect(Object.getPrototypeOf(app[appFieldName])).toBe(
				constructor.prototype
			);
			expect(Object.getPrototypeOf(constructor.prototype)).toBe(
				DummyClass.prototype
			);
		});
		it(`should do nothing if app.${appFieldName} is not defined`, () => {
			const app: { [K in typeof appFieldName]?: undefined } = {};
			hookFunction(app);
			expect(app[appFieldName]).toBeUndefined();
		});
	});
});
