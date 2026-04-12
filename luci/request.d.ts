/**
 * HTTP request handling utilities for LuCI.
 * The Request class allows initiating HTTP requests and provides utilities for dealing with responses.
 * @see https://openwrt.github.io/luci/jsapi/LuCI.request.html
 */
declare namespace LuCI.request {
  /**
   * Options for configuring HTTP requests.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.request.html#.RequestOptions
   */
  interface RequestOptions {
    /**
     * The HTTP method to use, e.g. `GET` or `POST`.
     * @default 'GET'
     */
    method?: string;

    /**
     * Query string data to append to the URL.
     * Non-string values of the given object will be converted to JSON.
     */
    query?: Record<string, unknown | string>;

    /**
     * Specifies whether the HTTP response may be retrieved from cache.
     * @default false
     */
    cache?: boolean;

    /**
     * Provides a username for HTTP basic authentication.
     */
    username?: string;

    /**
     * Provides a password for HTTP basic authentication.
     */
    password?: string;

    /**
     * Specifies the request timeout in milliseconds.
     */
    timeout?: number;

    /**
     * Whether to include credentials such as cookies in the request.
     * @default false
     */
    credentials?: boolean;

    /**
     * Overrides the request response type.
     * Valid values are `text` to interpret the response as UTF-8 string
     * or `blob` to handle the response as binary `Blob` data.
     */
    responseType?: 'text' | 'blob';

    /**
     * Specifies the HTTP message body to send along with the request.
     * If the value is a function, it is invoked and the return value used as content.
     * If it is a FormData instance, it is used as-is.
     * If it is an object, it will be converted to JSON.
     * In all other cases it is converted to a string.
     */
    content?: unknown;

    /**
     * Specifies HTTP headers to set for the request.
     */
    headers?: Record<string, string>;

    /**
     * An optional request callback function which receives ProgressEvent instances
     * as sole argument during the HTTP request transfer.
     */
    progress?: (event: ProgressEvent) => void;

    /**
     * An optional request callback function which receives ProgressEvent instances
     * as sole argument during the HTTP response transfer.
     */
    responseProgress?: (event: ProgressEvent) => void;
  }

  /**
   * Interceptor function type for HTTP response handling.
   * Interceptor functions are invoked whenever an HTTP reply is received,
   * in the order these functions have been registered.
   * @param res - The HTTP response object
   * @returns The interceptor function may return a modified response or void
   * @see https://openwrt.github.io/luci/jsapi/LuCI.request.html#.interceptorFn
   */
  type interceptorFn = (res: LuCI.response) => LuCI.response | void;

  /**
   * Turn the given relative URL into an absolute URL if necessary.
   * @param url - The URL to convert
   * @returns The absolute URL derived from the given one, or the original URL if it already was absolute
   * @see https://openwrt.github.io/luci/jsapi/LuCI.request.html#expandURL
   */
  function expandURL(url: string): string;

  /**
   * Initiate an HTTP GET request to the given target.
   * @param url - The URL to request
   * @param options - Additional options to configure the request
   * @returns A Promise that resolves to the resulting HTTP response
   * @see https://openwrt.github.io/luci/jsapi/LuCI.request.html#get
   */
  function get(url: string, options?: RequestOptions): Promise<LuCI.response>;

  /**
   * Initiate an HTTP POST request to the given target.
   * @param url - The URL to request
   * @param data - The request data to send, see RequestOptions for details
   * @param options - Additional options to configure the request
   * @returns A Promise that resolves to the resulting HTTP response
   * @see https://openwrt.github.io/luci/jsapi/LuCI.request.html#post
   */
  function post(url: string, data?: unknown, options?: RequestOptions): Promise<LuCI.response>;

  /**
   * Initiate an HTTP request to the given target.
   * @param target - The URL to request
   * @param options - Additional options to configure the request
   * @returns A Promise that resolves to the resulting HTTP response
   * @see https://openwrt.github.io/luci/jsapi/LuCI.request.html#request
   */
  function request(target: string, options?: RequestOptions): Promise<LuCI.response>;

  /**
   * Register an HTTP response interceptor function.
   * Interceptor functions are useful to perform default actions on incoming HTTP responses,
   * such as checking for expired authentication or for implementing request retries
   * before returning a failure.
   * @param interceptorFn - The interceptor function to register
   * @returns The registered function
   * @see https://openwrt.github.io/luci/jsapi/LuCI.request.html#addInterceptor
   */
  function addInterceptor(interceptorFn: interceptorFn): interceptorFn;

  /**
   * Remove an HTTP response interceptor function.
   * The passed function value must be the very same value that was used to register the function.
   * @param interceptorFn - The interceptor function to remove
   * @returns Returns `true` if any function has been removed, else `false`
   * @see https://openwrt.github.io/luci/jsapi/LuCI.request.html#removeInterceptor
   */
  function removeInterceptor(interceptorFn: interceptorFn): boolean;

  /**
   * Handle XHR readyState changes for an in-flight request and resolve or reject the originating promise.
   * @param resolveFn - Callback invoked on success with the constructed LuCI.response
   * @param rejectFn - Callback invoked on failure or abort with an Error instance
   * @param ev - The XHR `readystatechange` event (optional)
   * @see https://openwrt.github.io/luci/jsapi/LuCI.request.html#handleReadyStateChange
   */
  function handleReadyStateChange(
    resolveFn: (res: LuCI.response) => void,
    rejectFn: (error: Error) => void,
    ev?: Event
  ): void;

  /**
   * Polling utilities for repeating HTTP requests.
   * The Request.poll class provides convenience wrappers around LuCI.poll
   * mainly to simplify registering repeating HTTP request calls as polling functions.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.request.poll.html
   */
  namespace poll {
    /**
     * Callback function invoked whenever an HTTP reply to a polled request is received
     * or when the polled request timed out.
     * @param res - The HTTP response object
     * @param data - The response JSON if the response could be parsed as such, else null
     * @param duration - The total duration of the request in milliseconds
     * @see https://openwrt.github.io/luci/jsapi/LuCI.request.poll.html#~callbackFn
     */
    type callbackFn<T = unknown> = (res: LuCI.response, data: T | null, duration: number) => void;

    /**
     * Register a repeating HTTP request with an optional callback to invoke
     * whenever a response for the request is received.
     * @param interval - The poll interval in seconds
     * @param url - The URL to request on each poll
     * @param options - Additional options to configure the request
     * @param callback - Callback function to invoke for each HTTP reply
     * @returns The internally created poll function
     * @throws TypeError when an invalid interval was passed
     * @see https://openwrt.github.io/luci/jsapi/LuCI.request.poll.html#add
     */
    function add<T = unknown>(
      interval: number,
      url: string,
      options?: RequestOptions,
      callback?: callbackFn<T>
    ): () => void;

    /**
     * Remove a polling request that has been previously added using add().
     * This function is essentially a wrapper around LuCI.poll.remove().
     * @param entry - The poll function returned by add()
     * @returns Returns `true` if any function has been removed, else `false`
     * @see https://openwrt.github.io/luci/jsapi/LuCI.request.poll.html#remove
     */
    function remove(entry: () => void): boolean;

    /**
     * Alias for LuCI.poll.active().
     * @returns Whether polling is currently active
     * @see https://openwrt.github.io/luci/jsapi/LuCI.request.poll.html#active
     */
    function active(): boolean;

    /**
     * Alias for LuCI.poll.start().
     * @returns Whether polling was started successfully
     * @see https://openwrt.github.io/luci/jsapi/LuCI.request.poll.html#start
     */
    function start(): boolean;

    /**
     * Alias for LuCI.poll.stop().
     * @returns Whether polling was stopped successfully
     * @see https://openwrt.github.io/luci/jsapi/LuCI.request.poll.html#stop
     */
    function stop(): boolean;
  }
}
