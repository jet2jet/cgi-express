import { readEnv } from '../../utils.js';

// @internal
const DEFAULT_VERSION = [1, 0] as const;

// @internal
export default function parseHttpVersion(
	env: Record<string, string | undefined>
): readonly [major: number, minor: number] {
	const serverProtocol = readEnv(env, 'SERVER_PROTOCOL');
	if (serverProtocol === undefined) {
		// return default
		return DEFAULT_VERSION;
	}
	const ra = /^HTTP\/(\d+)(?:\.(\d+))?$/i.exec(serverProtocol);
	if (!ra) {
		return DEFAULT_VERSION;
	}
	return [Number(ra[1]), Number(ra[2])];
}
