import type * as express from 'express';

import type Options from './Options';

import executeCore from './executeCore';
import { hookStdout } from './utils';

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
