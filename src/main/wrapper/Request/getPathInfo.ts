import { readEnv } from '../../utils.js';

// @internal
export default function getPathInfo(
	env: Record<string, string | undefined>
): string | undefined {
	return readEnv(env, 'PATH_INFO');
}
