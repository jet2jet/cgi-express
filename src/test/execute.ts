import { mocked } from 'ts-jest/utils';

import execute from '@/execute.js';
import executeCore from '@/executeCore.js';
import { hookStdout } from '@/utils.js';

jest.mock('@/executeCore');
jest.mock('@/utils');

describe('execute', () => {
	let env: typeof process.env;
	beforeAll(() => {
		env = process.env;
	});
	afterAll(() => {
		process.env = env;
	});

	it('should call executeCore with appropriate values', async () => {
		const app = Object.create(null);
		app.__typename = 'app object';
		const opt = Object.create(null);
		opt.__typename = 'opt object';

		const dummyStdin = Object.create(null);
		dummyStdin.__typename = 'stdin object';
		const dummyStdout = Object.create(null);
		dummyStdout.__typename = 'stdout object';
		const dummyStderr = Object.create(null);
		dummyStderr.__typename = 'stderr object';
		const dummyEnv = Object.create(null);
		dummyEnv.__typename = 'env object';
		process.env = dummyEnv;
		jest.spyOn(process, 'stdin', 'get').mockReturnValue(dummyStdin);
		jest.spyOn(process, 'stdout', 'get').mockReturnValue(dummyStdout);
		jest.spyOn(process, 'stderr', 'get').mockReturnValue(dummyStderr);

		const dummyStdout2 = Object.create(null);
		dummyStdout2.__typename = 'stdout2 object';
		mocked(hookStdout).mockReturnValueOnce(dummyStdout2);

		await execute(app, opt);

		expect(hookStdout).toHaveBeenCalledWith(dummyStdout, dummyStderr);
		expect(executeCore).toHaveBeenCalledWith(app, {
			...opt,
			env: dummyEnv,
			stdin: dummyStdin,
			stdout: dummyStdout2,
		});
	});
});
