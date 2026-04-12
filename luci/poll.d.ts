/**
 * The Poll class allows registering and unregistering poll actions,
 * as well as starting, stopping, and querying the state of the polling loop.
 * @see https://openwrt.github.io/luci/jsapi/LuCI.poll.html
 */
declare namespace LuCI.poll {
  /**
   * Add a new operation to the polling loop.
   * If the polling loop is not already started at this point, it will be implicitly started.
   * @param fn - The function to invoke on each poll interval.
   * @param interval - The poll interval in seconds.
   * @returns true if the function has been added, false if it already is registered.
   * @throws {TypeError} Throws TypeError when an invalid interval was passed.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.poll.html#add
   */
  function add(fn: () => void, interval: number): boolean;

  /**
   * Remove an operation from the polling loop.
   * If no further operations are registered, the polling loop is implicitly stopped.
   * @param fn - The function to remove.
   * @returns true if the function has been removed, false if it wasn't found.
   * @throws {TypeError} Throws TypeError when the given argument isn't a function.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.poll.html#remove
   */
  function remove(fn: () => void): boolean;

  /**
   * (Re)start the polling loop.
   * Dispatches a custom poll-start event to the document object upon successful start.
   * @returns true if polling has been started (or if no functions where registered), false when the polling loop already runs.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.poll.html#start
   */
  function start(): boolean;

  /**
   * Stop the polling loop.
   * Dispatches a custom poll-stop event to the document object upon successful stop.
   * @returns true if polling has been stopped, false if it didn't run to begin with.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.poll.html#stop
   */
  function stop(): boolean;

  /**
   * Test whether the polling loop is running.
   * @returns true if polling is active, else false.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.poll.html#active
   */
  function active(): boolean;
}
