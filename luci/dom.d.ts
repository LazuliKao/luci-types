declare namespace LuCI.dom {
  /**
   * Callback function type for ignoring elements in isEmpty.
   *
   * @see LuCI.dom.isEmpty
   */
  type ignoreCallbackFn = (node: Node | HTMLElement) => boolean;

  /**
   * Append one or more child elements to a parent node.
   *
   * This function appends one or more child nodes or elements to the given parent node.
   * If `children` is omitted, the `node` is returned as-is.
   *
   * @param {Node | HTMLElement | DocumentFragment} node
   * The parent node to append children to.
   *
   * @param {Node | HTMLElement | DocumentFragment | (Node | HTMLElement | DocumentFragment)[]} [children]
   * The child node(s) or element(s) to append. Can be a single node or an array of nodes.
   *
   * @returns {Node | HTMLElement}
   * Returns the parent node.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#append
   */
  function append(
    node: Node | HTMLElement | DocumentFragment,
    children?: Node | HTMLElement | DocumentFragment | (Node | HTMLElement | DocumentFragment)[]
  ): Node | HTMLElement;

  /**
   * Get or set DOM node attributes.
   *
   * This function allows getting or setting one or more attributes on a DOM node.
   * When only `node` and `key` are provided, returns the attribute value.
   * When `val` is also provided, sets the attribute.
   *
   * @param {Node | HTMLElement | DocumentFragment} node
   * The DOM node to query or modify.
   *
   * @param {string} key
   * The attribute name.
   *
   * @param {string | null} [val]
   * The attribute value to set. If omitted, the current value is returned.
   * Pass `null` to remove the attribute.
   *
   * @returns {string | null | void}
   * Returns the attribute value when `val` is omitted, otherwise void.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#attr
   */
  function attr(
    node: Node | HTMLElement | DocumentFragment,
    key: string,
    val?: string | null
  ): string | null | void;

  /**
   * Bind a class instance to a DOM node.
   *
   * Attaches a class instance as data to a DOM node for later retrieval.
   * This is useful for associating JavaScript objects with DOM elements.
   *
   * @param {Node | HTMLElement | DocumentFragment} node
   * The DOM node to bind the instance to.
   *
   * @param {any} inst
   * The class instance or object to bind.
   *
   * @returns {void}
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#bindClassInstance
   */
  function bindClassInstance(node: Node | HTMLElement | DocumentFragment, inst: any): void;

  /**
   * Call a method on a class instance bound to a DOM node.
   *
   * Retrieves the class instance bound to a DOM node and calls the specified method
   * with the provided arguments.
   *
   * @param {Node | HTMLElement | DocumentFragment} node
   * The DOM node with a bound class instance.
   *
   * @param {string} method
   * The name of the method to call.
   *
   * @param {...any[]} args
   * Arguments to pass to the method.
   *
   * @returns {any}
   * Returns the result of the method call.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#callClassMethod
   */
  function callClassMethod(
    node: Node | HTMLElement | DocumentFragment,
    method: string,
    ...args: any[]
  ): any;

  /**
   * Replace or retrieve the content of a DOM node.
   *
   * This function sets or retrieves the content of a DOM element.
   * When only `node` is provided, returns the current content.
   * When `children` is provided, replaces the content.
   *
   * @param {Node | HTMLElement | DocumentFragment} node
   * The DOM node to query or modify.
   *
   * @param {Node | HTMLElement | DocumentFragment | (Node | HTMLElement | DocumentFragment)[]} [children]
   * The new content. Can be a single node or an array of nodes.
   * If omitted, the current content is returned.
   *
   * @returns {Node | HTMLElement | void}
   * Returns the node or current content when `children` is omitted, otherwise void.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#content
   */
  function content(
    node: Node | HTMLElement | DocumentFragment,
    children?: Node | HTMLElement | DocumentFragment | (Node | HTMLElement | DocumentFragment)[]
  ): Node | HTMLElement | void;

  /**
   * Create a new DOM element from an HTML string.
   *
   * Parses an HTML string and creates a new DOM element.
   * Optionally applies attributes and data to the created element.
   *
   * @param {string} html
   * The HTML string to parse and create an element from.
   *
   * @param {Record<string, string>} [attr]
   * An object containing attribute names and values to set on the created element.
   *
   * @param {Record<string, any>} [data]
   * An object containing data key-value pairs to attach to the element.
   *
   * @returns {HTMLElement}
   * Returns the created DOM element.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#create
   */
  function create(
    html: string,
    attr?: Record<string, string>,
    data?: Record<string, any>
  ): HTMLElement;

  /**
   * Get or set data attributes on a DOM node.
   *
   * This function allows getting or setting data values associated with a DOM node.
   * When only `node` is provided, returns all data.
   * When `key` is provided without `val`, returns the value for that key.
   * When both `key` and `val` are provided, sets the data.
   *
   * @param {Node | HTMLElement | DocumentFragment} node
   * The DOM node to query or modify.
   *
   * @param {string} [key]
   * The data key. If omitted, all data is returned.
   *
   * @param {any} [val]
   * The data value to set. If omitted, the current value is returned.
   *
   * @returns {any}
   * Returns the data value, all data, or void depending on parameters.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#data
   */
  function data(node: Node | HTMLElement | DocumentFragment, key?: string, val?: any): any;

  /**
   * Test whether a given value is a DOM element.
   *
   * Checks if the provided value is a DOM element node.
   *
   * @param {any} e
   * The value to test.
   *
   * @returns {boolean}
   * Returns `true` if the value is a DOM element, `false` otherwise.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#elem
   */
  function elem(e: any): boolean;

  /**
   * Find a class instance bound to a DOM node.
   *
   * Searches the DOM node and its ancestors for a bound class instance.
   *
   * @param {Node | HTMLElement | DocumentFragment} node
   * The DOM node to start the search from.
   *
   * @returns {any | null}
   * Returns the bound class instance, or `null` if not found.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#findClassInstance
   */
  function findClassInstance(node: Node | HTMLElement | DocumentFragment): any | null;

  /**
   * Test whether a given DOM node is empty.
   *
   * Checks if a DOM node contains no visible content.
   * Optionally accepts a callback function to ignore specific nodes.
   *
   * @param {Node | HTMLElement | DocumentFragment} node
   * The DOM node to test.
   *
   * @param {ignoreCallbackFn} [ignoreFn]
   * Optional callback function to determine which nodes to ignore.
   * The callback is called for each child node and should return `true` to ignore the node.
   *
   * @returns {boolean}
   * Returns `true` if the node is empty (or contains only ignored nodes), `false` otherwise.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#isEmpty
   */
  function isEmpty(node: Node | HTMLElement | DocumentFragment, ignoreFn?: ignoreCallbackFn): boolean;

  /**
   * Test whether a DOM node matches a CSS selector.
   *
   * Checks if a DOM element matches the given CSS selector.
   *
   * @param {Node | HTMLElement | DocumentFragment} node
   * The DOM node to test.
   *
   * @param {string} selector
   * The CSS selector to match against.
   *
   * @returns {boolean}
   * Returns `true` if the node matches the selector, `false` otherwise.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#matches
   */
  function matches(node: Node | HTMLElement | DocumentFragment, selector: string): boolean;

  /**
   * Find the parent node matching a CSS selector.
   *
   * Walks up the DOM tree from the given node until a parent matching
   * the selector is found.
   *
   * @param {Node | HTMLElement | DocumentFragment} node
   * The DOM node to start searching from.
   *
   * @param {string} selector
   * The CSS selector to match against parent nodes.
   *
   * @returns {HTMLElement | null}
   * Returns the first parent node matching the selector, or `null` if not found.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#parent
   */
  function parent(node: Node | HTMLElement | DocumentFragment, selector: string): HTMLElement | null;

  /**
   * Parse an HTML or XML string into a DOM node.
   *
   * Parses a string containing HTML or XML markup and returns the resulting DOM node(s).
   *
   * @param {string} s
   * The HTML or XML string to parse.
   *
   * @returns {Node | HTMLElement | DocumentFragment | (Node | HTMLElement | DocumentFragment)[]}
   * Returns the parsed DOM node(s).
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#parse
   */
  function parse(s: string): Node | HTMLElement | DocumentFragment | (Node | HTMLElement | DocumentFragment)[];
}
