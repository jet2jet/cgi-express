import { readEnv } from '../../utils.js';

// @internal
export default function getMethod(
	env: Record<string, string | undefined>
): string {
	const requestMethod = readEnv(env, 'REQUEST_METHOD');
	if (requestMethod === undefined) {
		// return default
		return 'GET';
	}
	return requestMethod.toUpperCase();
}
