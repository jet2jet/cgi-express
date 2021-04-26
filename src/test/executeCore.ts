import { mocked } from 'ts-jest/utils';

import executeCore from '@/executeCore';
import { hookExpressjsRequest, hookExpressjsResponse } from '@/utils';
import Request from '@/wrapper/Request';
import Response from '@/wrapper/Response';

jest.mock('@/utils');
jest.mock('@/wrapper/Request');
jest.mock('@/wrapper/Response');

describe('executeCore', () => {
	const req = Object.create(null);
	req.__typename = 'request object';
	const res = Object.create(null);
	res.__typename = 'response object';

	beforeAll(() => {
		mocked(Request).mockReturnValue(req);
		mocked(Response).mockReturnValue(res);
	});

	it("should call 'app' as function, with calling hookExpressjs***", async () => {
		const stdin = Object.create(null);
		stdin.__typename = 'stdin object';
		const stdout = Object.create(null);
		stdout.__typename = 'stdout object';
		const env = Object.create(null);
		env.__typename = 'env object';
		const app: any = jest.fn();

		const promise = executeCore(app, { stdin, stdout, env });
		await new Promise((resolve) => process.nextTick(resolve));

		expect(hookExpressjsRequest).toHaveBeenCalledWith(app);
		expect(hookExpressjsResponse).toHaveBeenCalledWith(app);
		expect(Request).toHaveBeenCalledWith(stdin, env);
		expect(Response).toHaveBeenCalledWith(req, stdout, expect.anything());
		expect(mocked(Response).mock.calls[0][2]).toBeInstanceOf(Function);

		mocked(Response).mock.calls[0][2]?.();

		await promise;
		expect(app).toHaveBeenCalledWith(req, res);
	});
});
