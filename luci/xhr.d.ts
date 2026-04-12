declare namespace LuCI.xhr {
  /**
   * Creates a new XHR request object for making HTTP requests.
   *
   * Note: This class is a legacy compatibility shim for functionality formerly provided by xhr.js.
   * It is registered as a global window.XHR symbol for compatibility with legacy code.
   * New code should use LuCI.request instead to implement HTTP request handling.
   *
   * @deprecated Use LuCI.request instead
   * @see https://openwrt.github.io/luci/jsapi/LuCI.xhr.html
   */
  class xhr {
    /**
     * Ignored for backwards compatibility.
     * This function does nothing.
     *
     * @deprecated Yes
     * @see https://openwrt.github.io/luci/jsapi/LuCI.xhr.html
     */
    abort(): void;

    /**
     * Checks the running state of the request.
     *
     * @deprecated Yes
     * @returns Returns true if the request is still running or false if it already completed
     * @see https://openwrt.github.io/luci/jsapi/LuCI.xhr.html
     */
    busy(): boolean;

    /**
     * Cancels a running request.
     *
     * Note: This function does not actually cancel the underlying XMLHTTPRequest request
     * but it sets a flag which prevents the invocation of the callback function when the
     * request eventually finishes or timed out.
     *
     * @deprecated Yes
     * @see https://openwrt.github.io/luci/jsapi/LuCI.xhr.html
     */
    cancel(): void;

    /**
     * This function is a legacy wrapper around LuCI.get().
     *
     * @param url - The URL to request
     * @param data - Optional additional query string data
     * @param callback - Optional callback function to invoke on completion
     * @param timeout - Optional request timeout to use
     * @deprecated Yes
     * @returns A promise that resolves to null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.xhr.html
     */
    get(url: string, data?: Record<string, unknown>, callback?: LuCI.requestCallbackFn, timeout?: number): Promise<null>;

    /**
     * This function is a legacy wrapper around LuCI.post().
     *
     * @param url - The URL to request
     * @param data - Optional additional data to append to the request body
     * @param callback - Optional callback function to invoke on completion
     * @param timeout - Optional request timeout to use
     * @deprecated Yes
     * @returns A promise that resolves to null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.xhr.html
     */
    post(url: string, data?: Record<string, unknown>, callback?: LuCI.requestCallbackFn, timeout?: number): Promise<null>;

    /**
     * Existing for backwards compatibility.
     * This function simply throws an InternalError when invoked.
     *
     * @deprecated Yes
     * @throws {InternalError} Throws an InternalError with the message "Not implemented" when invoked
     * @see https://openwrt.github.io/luci/jsapi/LuCI.xhr.html
     */
    send_form(): void;
  }
}
