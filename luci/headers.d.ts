declare namespace LuCI.headers {
  /**
   * Returns the value of the given header name.
   * Note: Header-Names are case-insensitive.
   *
   * @param name - The header name to read
   * @returns The value of the given header name or null if the header isn't present
   * @see https://openwrt.github.io/luci/jsapi/LuCI.headers.html
   */
  function get(name: string): string | null;

  /**
   * Checks whether the given header name is present.
   * Note: Header-Names are case-insensitive.
   *
   * @param name - The header name to check
   * @returns Returns true if the header name is present, false otherwise
   * @see https://openwrt.github.io/luci/jsapi/LuCI.headers.html
   */
  function has(name: string): boolean;
}
