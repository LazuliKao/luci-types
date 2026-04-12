/**
 * The session class provides various session related functionality.
 * @see https://openwrt.github.io/luci/jsapi/LuCI.session.html
 */
declare namespace LuCI.session {
  /**
   * Retrieve the current session ID.
   * @returns The current session ID.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.session.html#getID
   */
  function getID(): string;

  /**
   * Retrieve the current session token.
   * @returns The current session token or null if not logged in.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.session.html#getToken
   */
  function getToken(): string | null;

  /**
   * Retrieve data from the local session storage.
   * @param key - The key to retrieve from the session data store. If omitted, all session data will be returned.
   * @returns The stored session data or null if the given key wasn't found.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.session.html#getLocalData
   */
  function getLocalData(key?: string): unknown;

  /**
   * Set data in the local session storage.
   * @param key - The key to set in the session data store.
   * @param value - The value to store. It will be internally converted to JSON before being put in the session store.
   * @returns true if the data could be stored, false on error.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.session.html#setLocalData
   */
  function setLocalData(key: string, value: unknown): boolean;
}
