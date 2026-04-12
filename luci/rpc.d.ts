declare namespace LuCI.rpc {
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
    expect?: Record<string, any>;
    /** Specifies an optional filter function which is invoked to transform the received reply data. */
    filter?: filterFn;
    /** If set to true, non-zero ubus call status codes are treated as fatal error. Default: false */
    reject?: boolean;
  }

  /**
   * The generated invocation function encapsulates a single RPC method call.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#.invokeFn
   */
  type invokeFn = (...params: any[]) => Promise<any>;

  /**
   * The filter function is invoked to transform a received ubus RPC call reply.
   * @param data The received ubus reply data or a subset of it as described in the expect option.
   * @param args The arguments the RPC method has been invoked with.
   * @param extraArgs All extraneous arguments passed to the RPC method exceeding the declared arguments.
   * @returns The return value of the filter function will be returned to the caller of the RPC method as-is.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#.filterFn
   */
  type filterFn = (data: any, args: any[], ...extraArgs: any[]) => any;

  /**
   * Registered interceptor functions are invoked before the standard reply parsing and handling logic.
   * @param msg The unprocessed, JSON decoded remote RPC method call reply.
   * @param req The related request object which is an extended variant of the declaration object.
   * @returns Interceptor functions may return a promise to defer response processing until some delayed work completed.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#.interceptorFn
   */
  type interceptorFn = (msg: any, req: any) => Promise<any> | any;

  /**
   * Describes a remote RPC call procedure and returns a function implementing it.
   * @param options The options describing the RPC call.
   * @returns A new function implementing the method call described in options.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#declare
   */
  function declare(options: DeclareOptions): invokeFn;

  /**
   * Lists available remote ubus objects or the method signatures of specific objects.
   * When invoked without arguments, returns an array containing the names of all remote ubus objects.
   * When invoked with object names, returns method signatures for each given ubus object name.
   * @param args Optional object names to get method signatures for.
   * @returns Promise resolving to an array of object names or an object describing method signatures.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.rpc.html#list
   */
  function list(...args: string[]): Promise<string[] | Record<string, Record<string, Record<string, string>>>>;

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
