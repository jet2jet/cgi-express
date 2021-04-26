/** Options for `execute` / `executeCore` */
export default interface Options {
	/** Specifies custom stdin object */
	stdin?: NodeJS.ReadStream;
	/** Specifies custom stdout object */
	stdout?: NodeJS.WritableStream;
	/** Specifies custom map object for environment variables */
	env?: Record<string, string | undefined>;
}
