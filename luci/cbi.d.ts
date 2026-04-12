declare namespace LuCI.cbi {
  /**
   * Initialization for CBI UI elements, dependency handling, validation wiring and miscellaneous helpers.
   * Functions defined here are registered as global window.* symbols.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */

  /**
   * Create DOM elements using L.dom.create helper (convenience wrapper).
   *
   * @returns The created HTMLElement.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function E(): HTMLElement;

  /**
   * Lookup a translated string for the given message and optional context.
   * Falls back to the source string when no translation found.
   *
   * @param s - Source string.
   * @param copt - Optional translation context.
   * @returns Translated string or original.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function _(s: string, copt?: string): string;

  /**
   * Plural-aware translation lookup.
   *
   * @param n - Quantity to evaluate plural form.
   * @param s - Singular string.
   * @param p - Plural string.
   * @param copt - Optional context.
   * @returns Translated plural form or source string.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function N_(n: number, s: string, p: string, copt?: string): string;

  /**
   * Trim whitespace and normalise internal whitespace sequences to single spaces.
   *
   * @param s - Value to convert to string and trim.
   * @returns Trimmed and normalised string.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function trimws(s: any): string;

  /**
   * Read signed 8-bit integer from a byte array at the given offset.
   *
   * @param bytes - Byte array.
   * @param off - Offset into the array.
   * @returns Signed 8-bit value (returned as unsigned number).
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function s8(bytes: number[], off: number): number;

  /**
   * Read unsigned 16-bit little-endian integer from a byte array at offset.
   *
   * @param bytes - Byte array.
   * @param off - Offset into the array.
   * @returns Unsigned 16-bit integer.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function u16(bytes: number[], off: number): number;

  /**
   * Compute a stable 32-bit-ish string hash used for translation keys.
   * Encodes UTF-8 surrogate pairs and mixes bytes into a hex hash string.
   *
   * @param s - Input string.
   * @returns Hex hash string or null for empty input.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function sfh(s: string | null): string | null;

  /**
   * Return the element for input which may be an element or an id.
   *
   * @param e - Element or id.
   * @returns The HTMLElement or null.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function isElem(e: Element | string): HTMLElement | null;

  /**
   * Test whether node matches a CSS selector.
   *
   * @param node - Node to test.
   * @param selector - CSS selector.
   * @returns True if the node matches the selector.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function matchesElem(node: Node, selector: string): boolean;

  /**
   * Find the parent matching selector from node upwards.
   *
   * @param node - Starting node.
   * @param selector - CSS selector to match ancestor.
   * @returns The matching parent element or null.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function findParent(node: Node, selector: string): HTMLElement | null;

  /**
   * Initialize a dropdown element into an L.ui.Dropdown instance and bind it.
   * If already bound, this is a no-op.
   *
   * @param sb - The select element to convert.
   * @returns Dropdown instance or undefined when already bound.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function cbi_dropdown_init(sb: HTMLElement): LuCI.ui.Dropdown | undefined;

  /**
   * Register a dependency entry for a field.
   *
   * @param field - Field element or its id.
   * @param dep - Dependency specification object.
   * @param index - Order index of the dependent node.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function cbi_d_add(field: HTMLElement | string, dep: object, index: number): void;

  /**
   * Check whether an input/select identified by target matches the given reference value.
   *
   * @param target - Element id or name to query.
   * @param ref - Reference value to compare with.
   * @returns True if the current value matches ref.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function cbi_d_checkvalue(target: string, ref: string): boolean;

  /**
   * Evaluate a list of dependency descriptors and return whether any match.
   *
   * @param deps - Array of dependency objects to evaluate.
   * @returns True when dependencies indicate the element should be shown.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function cbi_d_check(deps: object[]): boolean;

  /**
   * Update DOM nodes based on registered dependencies, showing or hiding nodes
   * and restoring their order when dependency state changes.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function cbi_d_update(): void;

  /**
   * Initialize CBI widgets and wire up dependency and validation handlers.
   * Walks the DOM looking for CBI-specific data attributes and replaces
   * placeholders with interactive widgets.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function cbi_init(): void;

  /**
   * Run all validators associated with a form and optionally show an error.
   *
   * @param form - Form element containing validators.
   * @param errmsg - Message to show when validation fails.
   * @returns True when form is valid.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function cbi_validate_form(form: HTMLFormElement, errmsg?: string): boolean;

  /**
   * Enable/disable a named-section add button depending on input value.
   *
   * @param input - Input that contains the new section name.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function cbi_validate_named_section_add(input: HTMLInputElement): void;

  /**
   * Trigger a delayed form validation (used to allow UI state to settle).
   *
   * @param form - Form to validate after a short delay.
   * @returns Always returns true.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function cbi_validate_reset(form: HTMLFormElement): boolean;

  /**
   * Attach a validator to a field and wire validation events.
   *
   * @param cbid - Element or element id to validate.
   * @param optional - Whether an empty value is allowed.
   * @param type - Validator type expression (passed to L.validation).
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function cbi_validate_field(cbid: HTMLElement | string, optional: boolean, type: string): void;

  /**
   * Mark the last visible value container child with class cbi-value-last.
   *
   * @param container - Parent container element.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function cbi_tag_last(container: HTMLElement): void;

  /**
   * Submit a form, optionally adding a hidden input to pass a name/value pair.
   *
   * @param elem - Element inside the form or an element with a form.
   * @param name - Name of hidden input to include, if any.
   * @param value - Value for the hidden input (defaults to '1').
   * @param action - Optional form action URL override.
   * @returns True on successful submit, false when no form found.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function cbi_submit(elem: HTMLElement, name?: string, value?: string, action?: string): boolean;

  /**
   * Move a table row up or down within a section and update the storage field.
   *
   * @param elem - Element inside the row that triggers the swap.
   * @param up - If true, move the row up; otherwise move down.
   * @param store - ID of the hidden input used to store the order.
   * @returns Always returns false to cancel default action.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function cbi_row_swap(elem: HTMLElement, up: boolean, store: string): boolean;

  /**
   * Update or initialize a table UI widget with new data.
   *
   * @param table - Table element or selector.
   * @param data - Data to update the table with.
   * @param placeholder - Placeholder text when empty.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.module_cbi.html
   */
  function cbi_update_table(table: HTMLElement | string, ...data: (Node | string)[]): void;
}
