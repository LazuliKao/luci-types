declare namespace LuCI.rpc {
	// -----------------------------------------------------------------------
	//  Generic helper types for rpc.declare()
	// -----------------------------------------------------------------------

	/**
	 * Constrains the `params` option array length to match the args tuple `A`.
	 * When `A` is empty (`[]`), params must be omitted (`never`);
	 * otherwise params must be a `readonly string[]` of the same length.
	 */
	type ParamsForArgs<A extends unknown[]> = A extends []
		? never
		: { length: A["length"] } & readonly string[];

	/**
	 * When the generic `R` parameter is omitted (defaults to `unknown`),
	 * the declared function returns `undefined` — matching the case where
	 * no `expect` option is given.
	 */
	type InferReturn<R> = unknown extends R ? undefined : R;

	/**
	 * Signature of the generated RPC invocation function.
	 * Accepts args of type `A` and returns a `Promise<R>`.
	 */
	type RpcFn<A extends unknown[], R> = (...args: A) => Promise<R>;

	/**
	 * Options for declaring a remote RPC call procedure.
	 * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#.DeclareOptions
	 */
	interface DeclareOptions {
		/** The name of the remote ubus object to invoke. */
		object: string;
		/** The name of the remote ubus method to invoke. */
		method: string;
		/** Lists the named parameters expected by the remote ubus RPC method. */
		params?: string[];
		/** Describes the expected return data structure. */
		expect?: Record<string, unknown>;
		/** Specifies an optional filter function which is invoked to transform the received reply data. */
		filter?: filterFn;
		/** If set to true, non-zero ubus call status codes are treated as fatal error. Default: false */
		reject?: boolean;
	}

	/**
	 * The generated invocation function encapsulates a single RPC method call.
	 * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#.invokeFn
	 */
	type invokeFn = (...params: unknown[]) => Promise<unknown>;

	/**
	 * The filter function is invoked to transform a received ubus RPC call reply.
	 *
	 * @param data - The received ubus reply data or a subset of it as described
	 *   in the `expect` option. In case of remote call errors, `data` is a
	 *   numeric ubus error code instead.
	 * @param args - The arguments the RPC method has been invoked with.
	 * @param extraArgs - All extraneous arguments exceeding the number of
	 *   parameters described in the RPC call declaration.
	 * @returns The return value is passed back to the caller as-is.
	 * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#.filterFn
	 */
	type filterFn = (
		data: unknown,
		args: unknown[],
		...extraArgs: unknown[]
	) => unknown;

	/**
	 * Registered interceptor functions are invoked before the standard reply
	 * parsing and handling logic.
	 *
	 * @param msg - The received JSON-RPC message object.
	 * @param req - The internal request representation.
	 * @returns If the function returns a Promise, the interceptor chain awaits
	 *   it; otherwise the return value is ignored.
	 * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#.interceptorFn
	 */
	type interceptorFn = (
		msg: unknown,
		req: unknown,
	) => Promise<unknown> | unknown;

	/**
	 * Describes a remote RPC call procedure and returns a function implementing it.
	 *
	 * @typeParam R - Expected return type (omit for `undefined` return).
	 * @typeParam A - Args tuple matching the positional parameters.
	 * @param options - The RPC method declaration options.
	 * @returns A function that invokes the remote ubus method.
	 * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#declare
	 */
	function declare<R, A extends unknown[] = []>(
		options: DeclareOptions & { params?: ParamsForArgs<A> },
	): RpcFn<A, InferReturn<R>>;
	function declare(options?: DeclareOptions): invokeFn;

	/**
	 * Lists available remote ubus objects or the method signatures of specific objects.
	 * When invoked without arguments, returns an array containing the names of all remote ubus objects.
	 * When invoked with object names, returns method signatures for each given ubus object name.
	 * @param args Optional object names to get method signatures for.
	 * @returns Promise resolving to an array of object names or an object describing method signatures.
	 * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#list
	 */
	function list(
		...args: string[]
	): Promise<string[] | Record<string, Record<string, Record<string, string>>>>;

	/**
	 * Returns the current RPC session id.
	 * @returns The 32 byte session ID string used for authenticating remote requests.
	 * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#getSessionID
	 */
	function getSessionID(): string;

	/**
	 * Set the RPC session id to use.
	 * @param sid Sets the 32 byte session ID string used for authenticating remote requests.
	 * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#setSessionID
	 */
	function setSessionID(sid: string): void;

	/**
	 * Returns the current RPC base URL.
	 * @returns The RPC URL endpoint to issue requests against.
	 * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#getBaseURL
	 */
	function getBaseURL(): string;

	/**
	 * Set the RPC base URL to use.
	 * @param url Sets the RPC URL endpoint to issue requests against.
	 * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#setBaseURL
	 */
	function setBaseURL(url: string): void;

	/**
	 * Translates a numeric ubus error code into a human readable description.
	 * @param statusCode The numeric status code.
	 * @returns The textual description of the code.
	 * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#getStatusText
	 */
	function getStatusText(statusCode: number): string;

	/**
	 * Registers a new interceptor function.
	 * @param interceptorFn The interceptor function to register.
	 * @returns Returns the given function value.
	 * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#addInterceptor
	 */
	function addInterceptor(interceptorFn: interceptorFn): interceptorFn;

	/**
	 * Removes a registered interceptor function.
	 * @param interceptorFn The interceptor function to remove.
	 * @returns true if the given function has been removed or false if it has not been found.
	 * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#removeInterceptor
	 */
	function removeInterceptor(interceptorFn: interceptorFn): boolean;
}
