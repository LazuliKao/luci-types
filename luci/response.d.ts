/**
 * HTTP response handling class for LuCI.
 * The Response class is an internal utility class representing HTTP responses.
 * @see https://openwrt.github.io/luci/jsapi/LuCI.response.html
 */
declare namespace LuCI.response {
  /**
   * HTTP response object representing the result of an HTTP request.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.response.html
   */
  interface Response {
    /**
     * Describes whether the response is successful (status codes 200..299) or not.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.response.html#ok
     */
    ok: boolean;

    /**
     * The numeric HTTP status code of the response.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.response.html#status
     */
    status: number;

    /**
     * The HTTP status description message of the response.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.response.html#statusText
     */
    statusText: string;

    /**
     * The HTTP headers of the response.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.response.html#headers
     */
    headers: LuCI.headers;

    /**
     * The total duration of the HTTP request in milliseconds.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.response.html#duration
     */
    duration: number;

    /**
     * The final URL of the request, i.e. after following redirects.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.response.html#url
     */
    url: string;

    /**
     * Access the response content as JSON data.
     * @returns The parsed JSON data
     * @throws SyntaxError if the content isn't valid JSON
     * @see https://openwrt.github.io/luci/jsapi/LuCI.response.html#json
     */
    json<T = unknown>(): Promise<T>;

    /**
     * Access the response content as string.
     * @returns The response content as a string
     * @see https://openwrt.github.io/luci/jsapi/LuCI.response.html#text
     */
    text(): Promise<string>;

    /**
     * Access the response content as blob.
     * @returns The response content as a Blob
     * @see https://openwrt.github.io/luci/jsapi/LuCI.response.html#blob
     */
    blob(): Promise<Blob>;

    /**
     * Clones the given response object, optionally overriding the content of the cloned instance.
     * @param content - Override the content of the cloned response.
     *                  Object values will be treated as JSON response data,
     *                  all other types will be converted using String() and treated as response text.
     * @returns The cloned Response instance
     * @see https://openwrt.github.io/luci/jsapi/LuCI.response.html#clone
     */
    clone(content?: unknown): Response;
  }
}
