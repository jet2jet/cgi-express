import type * as express from 'express';

import type Options from './Options.js';

import executeCore from './executeCore.js';
import { hookStdout } from './utils.js';

/**
 * Executes Express.js application as a CGI program.
 * @param app An Express.js application instance
 * @param opts Additional options (`Options`) for execution
 * @returns Promise object which resolves when execution finishes
 */
export default function execute(
	app: express.Application,
	opts?: Options
): Promise<void> {
	const { stdout, stderr, stdin, env } = process;
	return executeCore(app, {
		stdin,
		stdout: hookStdout(stdout, stderr),
		env,
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		...(opts || {}),
	});
}
