export default interface Options {
	stdin?: NodeJS.ReadStream;
	stdout?: NodeJS.WritableStream;
	env?: Record<string, string | undefined>;
}
