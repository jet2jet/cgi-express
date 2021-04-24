import { readEnv } from '../../utils';

// @internal
export default function getQueryString(
	env: Record<string, string | undefined>
): string {
	const queryString = readEnv(env, 'QUERY_STRING');
	if (queryString === undefined) {
		// return default
		return '';
	}
	return queryString;
}
