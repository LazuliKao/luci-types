declare namespace LuCI.ui {
  /**
   * File upload response data
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.html#FileUploadReply
   */
  interface FileUploadReply {
    /** Name of the uploaded file without directory components */
    name: string;
    /** Size of the uploaded file in bytes */
    size: number;
    /** The MD5 checksum of the received file data */
    checksum: string;
    /** The SHA256 checksum of the received file data */
    sha256sum: string;
  }

  /**
   * UI changes manager for handling form changes and applying/resetting them
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.changes.html
   */
  class changes {
    /**
     * Display the changes dialog
     * Shows a modal dialog listing pending changes with options to apply or discard them.
     * @returns A promise that resolves when the dialog is closed
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.changes.html#display
     */
    display(): Promise<void>;

    /**
     * Apply pending changes
     * Attempts to apply all pending configuration changes and reload the page on success.
     * @returns A promise that resolves when changes have been applied
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.changes.html#apply
     */
    apply(): Promise<void>;

    /**
     * Reset pending changes
     * Discards all pending changes and restores the UI to the last saved state.
     * @returns A promise that resolves when changes have been reset
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.changes.html#reset
     */
    reset(): Promise<void>;
  }

  /**
   * UI menu manager for building and rendering navigation menus
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.menu.html
   */
  class menu {
    /**
     * Initialize the menu structure
     * Loads and processes the menu data for rendering.
     * @returns A promise that resolves when the menu is initialized
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.menu.html#init
     */
    init(): Promise<void>;

    /**
     * Render the menu to the DOM
     * Generates and inserts the menu markup into the page.
     * @returns A DOM Node representing the rendered menu
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.menu.html#render
     */
    render(): Node;
  }

  /**
   * UI tabs manager for tabbed interfaces
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.tabs.html
   */
  class tabs {
    /**
     * Add a tab to the tab group
     * Creates and adds a new tab with the specified name and content.
     * @param name - The name/identifier of the tab
     * @param title - The display title for the tab
     * @param content - The content to display in the tab (DOM node or string)
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.tabs.html#addTab
     */
    addTab(name: string, title: string, content: Node | string): void;

    /**
     * Switch to a specific tab
     * Activates the tab with the given name and displays its content.
     * @param name - The name/identifier of the tab to switch to
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.tabs.html#switchTab
     */
    switchTab(name: string): void;

    /**
     * Render the tab interface to the DOM
     * Generates and returns the complete tab markup.
     * @returns A DOM Node representing the rendered tabs
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.tabs.html#render
     */
    render(): Node;
  }

  /**
   * Add a notification banner at the top of the current view.
   * 
   * A notification banner is an alert message usually displayed at the top of the current view,
   * spanning the entire available width. Notification banners will stay in place until dismissed
   * by the user. Multiple banners may be shown at the same time.
   * 
   * Additional CSS class names may be passed to influence the appearance of the banner.
   * Valid values for the classes depend on the underlying theme.
   * 
   * @param title - Optional title of the notification banner. If null, no title element will be rendered.
   * @param children - The contents to add to the notification banner. This should be a DOM node
   *                    or a document fragment. The value is passed as-is to dom.content().
   * @param classes - Optional extra CSS class names to set on the notification banner element.
   *                  Can be repeated for multiple classes.
   * @returns A DOM Node representing the notification banner element
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.html#addNotification
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#content
   */
  function addNotification(
    title: string | null | undefined,
    children: Node | DocumentFragment | string,
    ...classes: string[]
  ): Node;

  /**
   * Add a time-limited notification banner at the top of the current view.
   * 
   * A notification banner is an alert message usually displayed at the top of the current view,
   * spanning the entire available width. Notification banners will stay in place until dismissed
   * by the user or it has expired. Multiple banners may be shown at the same time.
   * 
   * Additional CSS class names may be passed to influence the appearance of the banner.
   * Valid values for the classes depend on the underlying theme.
   * 
   * @param title - Optional title of the notification banner. If null, no title element will be rendered.
   * @param children - The contents to add to the notification banner. This should be a DOM node
   *                    or a document fragment. The value is passed as-is to dom.content().
   * @param timeout - Optional millisecond value after which the notification will disappear automatically.
   *                  If omitted, the notification will remain until dismissed.
   * @param classes - Optional extra CSS class names to set on the notification banner element.
   *                  Can be repeated for multiple classes.
   * @returns A DOM Node representing the notification banner element
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.html#addTimeLimitedNotification
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#content
   */
  function addTimeLimitedNotification(
    title: string | null | undefined,
    children: Node | DocumentFragment | string,
    timeout?: number,
    ...classes: string[]
  ): Node;

  /**
   * Display a modal overlay dialog with the specified contents.
   * 
   * The modal overlay dialog covers the current view preventing interaction with the underlying
   * view contents. Only one modal dialog instance can be opened. Invoking showModal() while a
   * modal dialog is already open will replace the open dialog with a new one.
   * 
   * Additional CSS class names may be passed to influence the appearance of the dialog.
   * Valid values for the classes depend on the underlying theme.
   * 
   * @param title - Optional title of the dialog. If null, no title element will be rendered.
   * @param children - The contents to add to the modal dialog. This should be a DOM node or
   *                    document fragment. The value is passed as-is to dom.content().
   * @param classes - Optional extra CSS class names to set on the modal dialog element.
   *                  Can be repeated for multiple classes.
   * @returns A DOM Node representing the modal dialog element
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.html#showModal
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#content
   */
  function showModal(
    title: string | null | undefined,
    children: Node | DocumentFragment | string,
    ...classes: string[]
  ): Node;

  /**
   * Close the open modal overlay dialog.
   * 
   * This function will close an open modal dialog and restore the normal view behaviour.
   * It has no effect if no modal dialog is currently open.
   * 
   * Note that this function is stand-alone and does not rely on this, making it suitable
   * to be used as an event handler without binding.
   * 
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.html#hideModal
   */
  function hideModal(): void;

  /**
   * Display or update a header area indicator.
   * 
   * An indicator is a small label displayed in the header area of the screen providing
   * status information such as item counts or state toggle indicators. Multiple indicators
   * may be shown at the same time and indicator labels may be made clickable to display
   * extended information or to initiate further actions.
   * 
   * Indicators can either use a default active or a less accented inactive style which is
   * useful for indicators representing state toggles.
   * 
   * @param id - The ID of the indicator. If an indicator with the given ID already exists,
   *             it is updated with the given label and style.
   * @param label - The text to display in the indicator label.
   * @param handler - Optional handler function to invoke when the indicator is clicked/touched.
   *                  Note that this parameter only applies to new indicators; when updating
   *                  existing labels it is ignored.
   * @param style - Optional indicator style ("active" or "inactive"). Defaults to "active".
   * @returns true when the indicator has been updated or false when no changes were made
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.html#showIndicator
   */
  function showIndicator(
    id: string,
    label: string,
    handler?: (() => void) | null,
    style?: "active" | "inactive"
  ): boolean;

  /**
   * Remove a header area indicator.
   * 
   * This function removes the given indicator label from the header indicator area.
   * When the given indicator is not found, this function does nothing.
   * 
   * @param id - The ID of the indicator to remove.
   * @returns true when the indicator has been removed or false when the requested indicator was not found
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.html#hideIndicator
   */
  function hideIndicator(id: string): boolean;

  /**
   * Formats a series of label/value pairs into list-like markup.
   * 
   * This function transforms a flat array of alternating label and value elements into
   * list-like markup, using the values in separators as separators and appends the resulting
   * nodes to the given parent DOM node.
   * 
   * Each label is suffixed with ":" and wrapped into a <strong> tag. The <strong> element
   * and the corresponding value are subsequently wrapped into a <span class="nowrap"> element.
   * 
   * @param node - The parent DOM node to append the markup to. Any previous child elements will be removed.
   * @param items - An alternating array of labels and values. Labels will be converted to strings,
   *                values may be of any type accepted by dom.content().
   * @param separators - Optional single value or array of separator values. The function will cycle
   *                     through the separators when joining pairs. Defaults to [E('br')].
   * @returns The parent DOM node the formatted markup has been added to
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.html#itemlist
   * @see https://openwrt.github.io/luci/jsapi/LuCI.dom.html#content
   */
  function itemlist(
    node: Node,
    items: Array<string | Node | number | boolean>,
    separators?: Node | DocumentFragment | string | Array<Node | DocumentFragment | string>
  ): Node;

  /**
   * Display a modal file upload prompt.
   * 
   * This function opens a modal dialog prompting the user to select and upload a file
   * to a predefined remote destination path.
   * 
   * @param path - The remote file path to upload the local file to.
   * @param progressStatusNode - Optional DOM text node whose content text is set to the progress
   *                             percentage value during file upload.
   * @returns A promise resolving to a file upload status object on success or rejecting with an error
   *          in case the upload failed or has been cancelled by the user
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.html#uploadFile
   */
  function uploadFile(path: string, progressStatusNode?: Text): Promise<FileUploadReply>;

  /**
   * Add validation constraints to an input element.
   * 
   * Compile the given type expression and optional validator function into a validation
   * function and bind it to the specified input element events.
   * 
   * @param field - The DOM input element node to bind the validation constraints to.
   * @param type - The datatype specification to describe validation constraints.
   * @param optional - Optional boolean specifying whether empty values are allowed (default: false).
   *                   If an input element is not marked optional it must not be empty.
   * @param vfunc - Optional custom validation function or array of validation functions.
   *                Each function must return true to accept the passed value. Non-true values
   *                are converted to strings and treated as validation error messages.
   * @param events - Optional list of events to bind (default: ["blur", "keyup"]).
   * @returns The compiled validator function which can be used to trigger field validation manually
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.html#addValidator
   * @see https://openwrt.github.io/luci/jsapi/LuCI.validation.html
   */
  function addValidator(
    field: HTMLElement,
    type: string,
    optional?: boolean,
    vfunc?: ((value: string) => boolean | string) | Array<(value: string) => boolean | string>,
    ...events: string[]
  ): (value?: string) => boolean | string;

  /**
   * Create a pre-bound event handler function.
   * 
   * Generate and bind a function suitable for use in event handlers. The generated function
   * automatically disables the event source element and adds an active indication to it by
   * adding appropriate CSS classes. It will also await any promises returned by the wrapped
   * function and re-enable the source element after the promises ran to completion.
   * 
   * @param ctx - The this context to use for the wrapped function.
   * @param fn - The function to wrap or a string property name to look up in ctx.
   *             The bound function will be invoked with ctx as this context.
   * @param args - Any further parameters are passed as-is to the bound event handler function
   *               in the same order as passed to createHandlerFn().
   * @returns The pre-bound handler function suitable for addEventListener(), or null if fn is
   *          a string which could not be found in ctx or if ctx[fn] is not a valid function
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.html#createHandlerFn
   */
  function createHandlerFn(
    ctx: any,
    fn: ((this: any, ...args: any[]) => any) | string,
    ...args: any[]
  ): ((event?: Event) => void) | null;

  /**
   * Perform a device connectivity test.
   * 
   * Attempt to fetch a well known resource from the remote device via HTTP in order to test
   * connectivity. This function is mainly useful to wait for the router to come back online
   * after a reboot or reconfiguration.
   * 
   * @param proto - Optional protocol to use ("http" or "https", defaults to "http").
   * @param ipaddr - Optional host address to probe. Defaults to window.location.host.
   * @returns A promise resolving to a load event if the device is reachable or rejecting with
   *          an error event if not reachable, or rejecting with null if connectivity check timed out
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.html#pingDevice
   */
  function pingDevice(proto?: "http" | "https", ipaddr?: string): Promise<Event>;

  /**
   * Wait for device to come back online and reconnect to it.
   * 
   * Poll each given hostname or IP address and navigate to it as soon as one of the
   * addresses becomes reachable.
   * 
   * @param hosts - Optional list of IP addresses and host names to check for reachability.
   *                Defaults to [window.location.host].
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.html#awaitReconnect
   */
  function awaitReconnect(...hosts: string[]): void;

  /**
   * Load specified view class path and set it up.
   * 
   * Transforms the given view path into a class name, requires it using LuCI.require() and
   * asserts that the resulting class instance is a descendant of LuCI.view.
   * 
   * By instantiating the view class, its corresponding contents are rendered and included
   * into the view area. Any runtime errors are caught and rendered using LuCI.error().
   * 
   * @param path - The view path to render.
   * @returns A promise resolving to the loaded view instance
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.html#instantiateView
   */
  function instantiateView(path: string): Promise<LuCI.View>;

  /**
   * AbstractElement is the abstract base class for the different widgets implemented by LuCI.ui.
   * It provides the common logic for getting and setting values, for checking the validity state
   * and for wiring up required events.
   *
   * UI widget instances are usually not supposed to be created by view code directly, instead
   * they're implicitly created by LuCI.form when instantiating CBI forms.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.AbstractElement.html
   */
  abstract class AbstractElement {
    /**
     * Instantiate an abstract element widget.
     * @param value - The initial input value
     * @param options - Object describing the widget specific options to initialize the input
     */
    constructor(value?: string | Array<string> | null, options?: AbstractElement.InitOptions);

    /**
     * Read the current value of the input widget.
     *
     * For simple inputs like text fields or selects, the return value type will be a - possibly
     * empty - string. Complex widgets such as DynamicList instances may result in an array of
     * strings or null for unset values.
     *
     * @returns The current value of the input element
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.AbstractElement.html#getValue
     */
    getValue(): string | Array<string> | null;

    /**
     * Set the current value of the input widget.
     *
     * For simple inputs like text fields or selects, the value should be a - possibly empty -
     * string. Complex widgets such as DynamicList instances may accept string array or null values.
     *
     * @param value - The value to set the input element to
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.AbstractElement.html#setValue
     */
    setValue(value: string | Array<string> | null): void;

    /**
     * Set the current placeholder value of the input widget.
     *
     * Only applicable to text inputs, not to radio buttons, selects or similar.
     *
     * @param value - The placeholder to set for the input element
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.AbstractElement.html#setPlaceholder
     */
    setPlaceholder(value: string | Array<string> | null): void;

    /**
     * Check whether the input value was altered by the user.
     *
     * Note that if the user modifies the initial value and changes it back to the original state,
     * it is still reported as changed.
     *
     * @returns Returns true if the input value has been altered by the user or false if it is unchanged
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.AbstractElement.html#isChanged
     */
    isChanged(): boolean;

    /**
     * Check whether the current input value is valid.
     *
     * @returns Returns true if the current input value is valid or false if it does not meet the validation constraints
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.AbstractElement.html#isValid
     */
    isValid(): boolean;

    /**
     * Returns the current validation error.
     *
     * @returns The validation error at this time
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.AbstractElement.html#getValidationError
     */
    getValidationError(): string;

    /**
     * Force validation of the current input value.
     *
     * Usually input validation is automatically triggered by various DOM events bound to the
     * input widget. In some cases it is required though to manually trigger validation runs,
     * e.g. when programmatically altering values.
     *
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.AbstractElement.html#triggerValidation
     */
    triggerValidation(): boolean;

    /**
     * Set up listeners for native DOM events that may update the widget value.
     *
     * Sets up event handlers on the given target DOM node for the given event names which may
     * cause the input value to update, such as keyup or onclick events. In contrast to change
     * events, such update events will trigger input value validation.
     *
     * @param targetNode - Specifies the DOM node on which the event listeners should be registered
     * @param events - The DOM events for which event handlers should be registered
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.AbstractElement.html#setUpdateEvents
     */
    setUpdateEvents(targetNode: Node, ...events: string[]): void;

    /**
     * Set up listeners for native DOM events that may change the widget value.
     *
     * Sets up event handlers on the given target DOM node for the given event names which may
     * cause the input value to change completely, such as change events in a select menu. In
     * contrast to update events, such change events will not trigger input value validation but
     * they may cause field dependencies to get re-evaluated and will mark the input widget as dirty.
     *
     * @param targetNode - Specifies the DOM node on which the event listeners should be registered
     * @param events - The DOM events for which event handlers should be registered
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.AbstractElement.html#setChangeEvents
     */
    setChangeEvents(targetNode: Node, ...events: string[]): void;

    /**
     * Dispatch a custom (synthetic) event in response to received events.
     *
     * Sets up event handlers on the given target DOM node for the given event names that dispatch
     * a custom event of the given type to the widget root DOM node. The primary purpose of this
     * function is to set up a series of custom uniform standard events such as widget-update,
     * validation-success, validation-failure etc. which are triggered by various different
     * widget specific native DOM events.
     *
     * @param targetNode - Specifies the DOM node on which the native event listeners should be registered
     * @param synevent - The name of the custom event to dispatch to the widget root DOM node
     * @param events - The native DOM events for which event handlers should be registered
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.AbstractElement.html#registerEvents
     */
    registerEvents(targetNode: Node, synevent: string, events: Array<string>): void;

    /**
     * Render the widget, set up event listeners and return resulting markup.
     *
     * @returns Returns a DOM Node or DocumentFragment containing the rendered widget markup
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.AbstractElement.html#render
     */
    render(): Node;
  }

  namespace AbstractElement {
    /**
     * Initialization options for AbstractElement widgets.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.AbstractElement.html#.InitOptions
     */
    interface InitOptions {
      /**
       * Specifies the widget ID to use. It will be used as HTML id attribute on the
       * toplevel widget DOM node.
       */
      id?: string;

      /**
       * Specifies the widget name which is set as HTML name attribute on the corresponding
       * input element.
       */
      name?: string;

      /**
       * Specifies whether the input field allows empty values. Defaults to true.
       */
      optional?: boolean;

      /**
       * An expression describing the input data validation constraints. It defaults to
       * string which will allow any value. See LuCI.validation for details on the expression format.
       */
      datatype?: string;

      /**
       * Specifies one or more custom validator functions which are invoked after the standard
       * validation constraints are checked. Each function should return true to accept the given
       * input value. When multiple functions are provided as an array, they are executed serially
       * and validation stops at the first function that returns a non-true value. Any non-true
       * return value type is converted to a string and treated as a validation error message.
       */
      validator?: ((value: string) => boolean | string) | Array<(value: string) => boolean | string>;

      /**
       * Specifies whether the widget should be rendered in disabled state (true) or not (false).
       * Disabled widgets cannot be interacted with and are displayed in a slightly faded style.
       * Defaults to false.
       */
      disabled?: boolean;
    }
  }

  /**
   * The Textfield class implements a standard single line text input field.
   *
   * UI widget instances are usually not supposed to be created by view code directly, instead
   * they're implicitly created by LuCI.form when instantiating CBI forms.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Textfield.html
   */
  class Textfield extends AbstractElement {
    /**
     * Instantiate a text input widget.
     * @param value - The initial input value
     * @param options - Object describing the widget specific options to initialize the input
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Textfield.html
     */
    constructor(value?: string | null, options?: Textfield.InitOptions);

    /**
     * Read the current value of the input widget.
     * @returns The current value of the input element
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Textfield.html#getValue
     */
    getValue(): string | null;

    /**
     * Set the current value of the input widget.
     * @param value - The value to set the input element to
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Textfield.html#setValue
     */
    setValue(value: string | null): void;

    /**
     * Render the widget, set up event listeners and return resulting markup.
     * @returns Returns a DOM Node or DocumentFragment containing the rendered widget markup
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Textfield.html#render
     */
    render(): Node;
  }

  namespace Textfield {
    /**
     * Initialization options for Textfield widgets.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Textfield.html#.InitOptions
     */
    interface InitOptions extends AbstractElement.InitOptions {
      /**
       * Specifies whether the input should be rendered as concealed password field.
       * Defaults to false.
       */
      password?: boolean;

      /**
       * Specifies whether the input widget should be rendered readonly.
       * Defaults to false.
       */
      readonly?: boolean;

      /**
       * Specifies the HTML maxlength attribute to set on the corresponding input element.
       * Note that this a legacy property that exists for compatibility reasons. It is usually
       * better to use maxlength(N) validation expression.
       */
      maxlength?: number;

      /**
       * Specifies the HTML placeholder attribute which is displayed when the corresponding
       * input element is empty.
       */
      placeholder?: string;
    }
  }

  /**
   * The Textarea class implements a multiline text area input field.
   *
   * UI widget instances are usually not supposed to be created by view code directly, instead
   * they're implicitly created by LuCI.form when instantiating CBI forms.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Textarea.html
   */
  class Textarea extends AbstractElement {
    /**
     * Instantiate a textarea widget.
     * @param value - The initial input value
     * @param options - Object describing the widget specific options to initialize the input
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Textarea.html
     */
    constructor(value?: string | null, options?: Textarea.InitOptions);

    /**
     * Read the current value of the input widget.
     * @returns The current value of the input element
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Textarea.html#getValue
     */
    getValue(): string | null;

    /**
     * Set the current value of the input widget.
     * @param value - The value to set the input element to
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Textarea.html#setValue
     */
    setValue(value: string | null): void;

    /**
     * Render the widget, set up event listeners and return resulting markup.
     * @returns Returns a DOM Node or DocumentFragment containing the rendered widget markup
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Textarea.html#render
     */
    render(): Node;
  }

  namespace Textarea {
    /**
     * Initialization options for Textarea widgets.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Textarea.html#.InitOptions
     */
    interface InitOptions extends AbstractElement.InitOptions {
      /**
       * Specifies whether the input widget should be rendered readonly.
       * Defaults to false.
       */
      readonly?: boolean;

      /**
       * Specifies the HTML placeholder attribute which is displayed when the corresponding
       * textarea element is empty.
       */
      placeholder?: string;

      /**
       * Specifies whether a monospace font should be forced for the textarea contents.
       * Defaults to false.
       */
      monospace?: boolean;

      /**
       * Specifies the HTML cols attribute to set on the corresponding textarea element.
       */
      cols?: number;

      /**
       * Specifies the HTML rows attribute to set on the corresponding textarea element.
       */
      rows?: number;

      /**
       * Specifies whether the HTML wrap attribute should be set.
       * Defaults to false.
       */
      wrap?: boolean;
    }
  }

  /**
   * The Checkbox class implements a simple checkbox input field.
   *
   * UI widget instances are usually not supposed to be created by view code directly, instead
   * they're implicitly created by LuCI.form when instantiating CBI forms.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Checkbox.html
   */
  class Checkbox extends AbstractElement {
    /**
     * Instantiate a checkbox widget.
     * @param value - The initial input value
     * @param options - Object describing the widget specific options to initialize the input
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Checkbox.html
     */
    constructor(value?: string | null, options?: Checkbox.InitOptions);

    /**
     * Test whether the checkbox is currently checked.
     * @returns Returns true when the checkbox is currently checked, otherwise false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Checkbox.html#isChecked
     */
    isChecked(): boolean;

    /**
     * Read the current value of the input widget.
     * @returns The current value of the input element
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Checkbox.html#getValue
     */
    getValue(): string | null;

    /**
     * Set the current value of the input widget.
     * @param value - The value to set the input element to
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Checkbox.html#setValue
     */
    setValue(value: string | null): void;

    /**
     * Render the widget, set up event listeners and return resulting markup.
     * @returns Returns a DOM Node or DocumentFragment containing the rendered widget markup
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Checkbox.html#render
     */
    render(): Node;
  }

  namespace Checkbox {
    /**
     * Initialization options for Checkbox widgets.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Checkbox.html#.InitOptions
     */
    interface InitOptions extends AbstractElement.InitOptions {
      /**
       * Specifies the value corresponding to a checked checkbox.
       * Defaults to "1".
       */
      value_enabled?: string;

      /**
       * Specifies the value corresponding to an unchecked checkbox.
       * Defaults to "0".
       */
      value_disabled?: string;

      /**
       * Specifies the HTML name attribute of the hidden input backing the checkbox.
       * This is a legacy property existing for compatibility reasons, it is required for
       * HTML based form submissions.
       */
      hiddenname?: string;
    }
  }

  /**
   * The Select class implements either a traditional HTML select element or a group of
   * checkboxes or radio buttons, depending on whether multiple values are enabled or not.
   *
   * UI widget instances are usually not supposed to be created by view code directly, instead
   * they're implicitly created by LuCI.form when instantiating CBI forms.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Select.html
   */
  class Select extends AbstractElement {
    /**
     * Instantiate a select dropdown or checkbox/radiobutton group.
     * @param value - The initial input value(s)
     * @param choices - Object containing the selectable choices of the widget. The object keys
     *                  serve as values for the different choices while the values are used as choice labels.
     * @param options - Object describing the widget specific options to initialize the inputs
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Select.html
     */
    constructor(value?: string | Array<string> | null, choices: { [key: string]: string }, options?: Select.InitOptions);

    /**
     * Read the current value of the input widget.
     * @returns The current value of the input element
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Select.html#getValue
     */
    getValue(): string | Array<string> | null;

    /**
     * Set the current value of the input widget.
     * @param value - The value to set the input element to
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Select.html#setValue
     */
    setValue(value: string | Array<string> | null): void;

    /**
     * Render the widget, set up event listeners and return resulting markup.
     * @returns Returns a DOM Node or DocumentFragment containing the rendered widget markup
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Select.html#render
     */
    render(): Node;
  }

  namespace Select {
    /**
     * Initialization options for Select widgets.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Select.html#.InitOptions
     */
    interface InitOptions extends AbstractElement.InitOptions {
      /**
       * Specifies whether multiple choice values may be selected.
       * Defaults to false.
       */
      multiple?: boolean;

      /**
       * Specifies the kind of widget to render. May be either "select" or "individual".
       * When set to "select" an HTML select element will be used, otherwise a group of
       * checkbox or radio button elements is created, depending on the value of the
       * multiple option. Defaults to "select".
       */
      widget?: "select" | "individual";

      /**
       * Specifies whether checkbox / radio button groups should be rendered in a
       * "horizontal" or "vertical" manner. Does not apply to the select widget type.
       * Defaults to "horizontal".
       */
      orientation?: string;

      /**
       * Specifies if and how to sort choice values. If set to true, the choice values
       * will be sorted alphabetically. If set to an array of strings, the choice sort
       * order is derived from the array. Defaults to false.
       */
      sort?: boolean | Array<string>;

      /**
       * Specifies the HTML size attribute to set on the select element.
       * Only applicable to the select widget type.
       */
      size?: number;

      /**
       * Specifies a placeholder text which is displayed when no choice is selected yet.
       * Only applicable to the select widget type.
       * Defaults to "-- Please choose --".
       */
      placeholder?: string;
    }
  }

  /**
   * The Dropdown class implements a rich, stylable dropdown menu which supports
   * non-text choice labels.
   *
   * UI widget instances are usually not supposed to be created by view code directly, instead
   * they're implicitly created by LuCI.form when instantiating CBI forms.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Dropdown.html
   */
  class Dropdown extends AbstractElement {
    /**
     * Instantiate a rich dropdown choice widget.
     * @param value - The initial input value(s)
     * @param choices - Object containing the selectable choices of the widget. The object keys
     *                  serve as values for the different choices while the values are used as choice labels.
     * @param options - Object describing the widget specific options to initialize the dropdown
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Dropdown.html
     */
    constructor(value?: string | Array<string> | null, choices: { [key: string]: any }, options?: Dropdown.InitOptions);

    /**
     * Add new choices to the dropdown menu.
     *
     * This function adds further choices to an existing dropdown menu, ignoring choice
     * values which are already present.
     *
     * @param values - The choice values to add to the dropdown widget
     * @param labels - The choice label values to use when adding dropdown choices.
     *                 If no label is found for a particular choice value, the value itself
     *                 is used as label text.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Dropdown.html#addChoices
     */
    addChoices(values: Array<string>, labels: { [key: string]: any }): void;

    /**
     * Remove all existing choices from the dropdown menu.
     *
     * This function removes all preexisting dropdown choices from the widget, keeping only
     * choices currently being selected unless reset_values is given, in which case all
     * choices and deselected and removed.
     *
     * @param reset_value - If set to true, deselect and remove selected choices as well
     *                      instead of keeping them. Defaults to false.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Dropdown.html#clearChoices
     */
    clearChoices(reset_value?: boolean): void;

    /**
     * Close all open dropdown widgets in the current document.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Dropdown.html#closeAllDropdowns
     */
    closeAllDropdowns(): void;

    /**
     * Read the current value of the input widget.
     * @returns The current value of the input element
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Dropdown.html#getValue
     */
    getValue(): string | Array<string> | null;

    /**
     * Set the current value of the input widget.
     * @param value - The value to set the input element to
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Dropdown.html#setValue
     */
    setValue(value: string | Array<string> | null): void;

    /**
     * Render the widget, set up event listeners and return resulting markup.
     * @returns Returns a DOM Node or DocumentFragment containing the rendered widget markup
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Dropdown.html#render
     */
    render(): Node;
  }

  namespace Dropdown {
    /**
     * Initialization options for Dropdown widgets.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Dropdown.html#.InitOptions
     */
    interface InitOptions extends AbstractElement.InitOptions {
      /**
       * Specifies whether the dropdown selection is optional. In contrast to other widgets,
       * the optional constraint of dropdowns works differently; instead of marking the widget
       * invalid on empty values when set to false, the user is not allowed to deselect all choices.
       * For single value dropdowns that means that no empty "please select" choice is offered
       * and for multi value dropdowns, the last selected choice may not be deselected without
       * selecting another choice first. Defaults to true.
       */
      optional?: boolean;

      /**
       * Specifies whether multiple choice values may be selected.
       * It defaults to true when an array is passed as input value to the constructor.
       */
      multiple?: boolean;

      /**
       * Specifies if and how to sort choice values. If set to true, the choice values will
       * be sorted alphabetically. If set to an array of strings, the choice sort order is
       * derived from the array. Defaults to false.
       */
      sort?: boolean | Array<string>;

      /**
       * Specifies a placeholder text which is displayed when no choice is selected yet.
       * Defaults to "-- Please choose --".
       */
      select_placeholder?: string;

      /**
       * Specifies a placeholder text which is displayed in the text input field allowing
       * to enter custom choice values. Only applicable if the create option is set to true.
       * Defaults to "-- custom --".
       */
      custom_placeholder?: string;

      /**
       * Specifies whether custom choices may be entered into the dropdown widget.
       * Defaults to false.
       */
      create?: boolean;

      /**
       * Specifies a CSS selector expression used to find the input element which is used
       * to enter custom choice values. This should not normally be used except by widgets
       * derived from the Dropdown class.
       */
      create_query?: string;

      /**
       * Specifies a CSS selector expression used to find an HTML element serving as template
       * for newly added custom choice values. Any {{value}} placeholder string within the
       * template elements text content will be replaced by the user supplied choice value,
       * the resulting string is parsed as HTML and appended to the end of the choice list.
       */
      create_template?: string;

      /**
       * This property allows specifying the markup for custom choices directly instead of
       * referring to a template element through CSS selectors. Apart from that it works
       * exactly like create_template.
       */
      create_markup?: string;

      /**
       * Specifies the maximum amount of choice labels that should be shown in collapsed
       * dropdown state before further selected choices are cut off. Only applicable when
       * multiple is true. Defaults to 3.
       */
      display_items?: number;

      /**
       * Specifies the maximum amount of choices that should be shown when the dropdown is open.
       * If the amount of available choices exceeds this number, the dropdown area must be
       * scrolled to reach further items. If set to -1, the dropdown menu will attempt to show
       * all choice values and only resort to scrolling if the amount of choices exceeds the
       * available screen space above and below the dropdown widget. Defaults to -1.
       */
      dropdown_items?: number;

      /**
       * This property serves as a shortcut to set both select_placeholder and custom_placeholder.
       * Either of these properties will fallback to placeholder if not specified.
       */
      placeholder?: string;

      /**
       * Specifies whether the custom choice input field should be rendered readonly.
       * Only applicable when create is true. Defaults to false.
       */
      readonly?: boolean;

      /**
       * Specifies the HTML maxlength attribute to set on the custom choice input element.
       * Note that this a legacy property that exists for compatibility reasons. It is usually
       * better to use maxlength(N) validation expression. Only applicable when create is true.
       */
      maxlength?: number;
    }
  }

  /**
   * The Combobox class implements a rich, stylable dropdown menu which allows to enter
   * custom values.
   *
   * Historically, comboboxes used to be a dedicated widget type in LuCI but nowadays they
   * are direct aliases of dropdown widgets with a set of enforced default properties for
   * easier instantiation.
   *
   * UI widget instances are usually not supposed to be created by view code directly, instead
   * they're implicitly created by LuCI.form when instantiating CBI forms.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Combobox.html
   */
  class Combobox extends Dropdown {
    /**
     * Instantiate a rich dropdown choice widget allowing custom values.
     * @param value - The initial input value(s)
     * @param choices - Object containing the selectable choices of the widget. The object keys
     *                  serve as values for the different choices while the values are used as choice labels.
     * @param options - Object describing the widget specific options to initialize the dropdown
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Combobox.html
     */
    constructor(value?: string | Array<string> | null, choices: { [key: string]: any }, options?: Combobox.InitOptions);
  }

  namespace Combobox {
    /**
     * Initialization options for Combobox widgets.
     *
     * Comboboxes support the same properties as Dropdown.InitOptions but enforce specific
     * values for the following properties:
     * - multiple: forcibly set to false (Comboboxes never allow selecting multiple values)
     * - create: forcibly set to true (Comboboxes always allow custom choice values)
     * - optional: forcibly set to true (Comboboxes are always optional)
     *
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Combobox.html#.InitOptions
     */
    interface InitOptions extends Dropdown.InitOptions {
      /**
       * Since Comboboxes never allow selecting multiple values, this property is forcibly set to false.
       * @override
       */
      multiple?: false;

      /**
       * Since Comboboxes always allow custom choice values, this property is forcibly set to true.
       * @override
       */
      create?: true;

      /**
       * Since Comboboxes are always optional, this property is forcibly set to true.
       * @override
       */
      optional?: true;
    }
  }

  /**
   * The ComboButton class implements a button element which can be expanded into a dropdown
   * to chose from a set of different action choices.
   *
   * UI widget instances are usually not supposed to be created by view code directly, instead
   * they're implicitly created by LuCI.form when instantiating CBI forms.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.ComboButton.html
   */
  class ComboButton extends Dropdown {
    /**
     * Instantiate a combo button widget offering multiple action choices.
     * @param value - The initial input value(s)
     * @param choices - Object containing the selectable choices of the widget. The object keys
     *                  serve as values for the different choices while the values are used as choice labels.
     * @param options - Object describing the widget specific options to initialize the button
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.ComboButton.html
     */
    constructor(value?: string | Array<string> | null, choices: { [key: string]: any }, options?: ComboButton.InitOptions);
  }

  namespace ComboButton {
    /**
     * Initialization options for ComboButton widgets.
     *
     * ComboButtons support the same properties as Dropdown.InitOptions but enforce specific
     * values for some properties and add additional button specific properties.
     *
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.ComboButton.html#.InitOptions
     */
    interface InitOptions extends Dropdown.InitOptions {
      /**
       * Since ComboButtons never allow selecting multiple actions, this property is forcibly set to false.
       * @override
       */
      multiple?: false;

      /**
       * Since ComboButtons never allow creating custom choices, this property is forcibly set to false.
       * @override
       */
      create?: false;

      /**
       * Since ComboButtons must always select one action, this property is forcibly set to false.
       * @override
       */
      optional?: false;

      /**
       * Specifies a mapping of choice values to CSS class names. If an action choice is selected
       * by the user and if a corresponding entry exists in the classes object, the class names
       * corresponding to the selected value are set on the button element. This is useful to
       * apply different button styles, such as colors, to the combined button depending on the
       * selected action.
       */
      classes?: { [key: string]: string };

      /**
       * Specifies a handler function to invoke when the user clicks the button. This function
       * will be called with the button DOM node as this context and receive the DOM click event
       * as first as well as the selected action choice value as second argument.
       */
      click?: (this: Node, event: Event, value: string) => void;
    }
  }

  /**
   * The DynamicList class implements a widget which allows the user to specify an arbitrary
   * amount of input values, either from free formed text input or from a set of predefined choices.
   *
   * UI widget instances are usually not supposed to be created by view code directly, instead
   * they're implicitly created by LuCI.form when instantiating CBI forms.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.DynamicList.html
   */
  class DynamicList extends AbstractElement {
    /**
     * Instantiate a dynamic list widget.
     * @param value - The initial input value(s)
     * @param choices - Object containing the selectable choices of the widget. The object keys
     *                  serve as values for the different choices while the values are used as choice labels.
     *                  If omitted, no default choices are presented to the user, instead a plain text
     *                  input field is rendered allowing the user to add arbitrary values to the dynamic list.
     * @param options - Object describing the widget specific options to initialize the dynamic list
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.DynamicList.html
     */
    constructor(value?: string | Array<string> | null, choices?: { [key: string]: any }, options?: DynamicList.InitOptions);

    /**
     * Add new suggested choices to the dynamic list.
     *
     * This function adds further choices to an existing dynamic list, ignoring choice
     * values which are already present.
     *
     * @param values - The choice values to add to the dynamic lists suggestion dropdown
     * @param labels - The choice label values to use when adding suggested choices.
     *                 If no label is found for a particular choice value, the value itself
     *                 is used as label text.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.DynamicList.html#addChoices
     */
    addChoices(values: Array<string>, labels: { [key: string]: any }): void;

    /**
     * Remove all existing choices from the dynamic list.
     *
     * This function removes all preexisting suggested choices from the widget.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.DynamicList.html#clearChoices
     */
    clearChoices(): void;

    /**
     * Read the current value of the input widget.
     * @returns The current value of the input element as an array of strings or null for unset values
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.DynamicList.html#getValue
     */
    getValue(): Array<string> | null;

    /**
     * Set the current value of the input widget.
     * @param value - The value to set the input element to
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.DynamicList.html#setValue
     */
    setValue(value: string | Array<string> | null): void;

    /**
     * Render the widget, set up event listeners and return resulting markup.
     * @returns Returns a DOM Node or DocumentFragment containing the rendered widget markup
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.DynamicList.html#render
     */
    render(): Node;
  }

  namespace DynamicList {
    /**
     * Initialization options for DynamicList widgets.
     *
     * In case choices are passed to the dynamic list constructor, the widget supports the
     * same properties as Dropdown.InitOptions but enforces specific values for some dropdown properties.
     *
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.DynamicList.html#.InitOptions
     */
    interface InitOptions extends Dropdown.InitOptions {
      /**
       * Since dynamic lists never allow selecting multiple choices when adding another list item,
       * this property is forcibly set to false.
       * @override
       */
      multiple?: false;

      /**
       * Since dynamic lists use an embedded dropdown to present a list of predefined choice values,
       * the dropdown must be made optional to allow it to remain unselected.
       * @override
       */
      optional?: true;
    }
  }

  /**
   * The FileUpload class implements a widget which allows the user to upload, browse,
   * select and delete files beneath a predefined remote directory.
   *
   * UI widget instances are usually not supposed to be created by view code directly, instead
   * they're implicitly created by LuCI.form when instantiating CBI forms.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.FileUpload.html
   */
  class FileUpload extends AbstractElement {
    /**
     * Instantiate a file upload widget.
     * @param value - The initial input value
     * @param options - Object describing the widget specific options to initialize the file upload control
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.FileUpload.html
     */
    constructor(value?: string | Array<string> | null, options?: FileUpload.InitOptions);

    /**
     * Read the current value of the input widget.
     * @returns The current value of the input element
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.FileUpload.html#getValue
     */
    getValue(): string | Array<string> | null;

    /**
     * Set the current value of the input widget.
     * @param value - The value to set the input element to
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.FileUpload.html#setValue
     */
    setValue(value: string | Array<string> | null): void;

    /**
     * Render the widget, set up event listeners and return resulting markup.
     * @returns Returns a DOM Node or DocumentFragment containing the rendered widget markup
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.FileUpload.html#render
     */
    render(): Node;
  }

  namespace FileUpload {
    /**
     * Initialization options for FileUpload widgets.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.FileUpload.html#.InitOptions
     */
    interface InitOptions extends AbstractElement.InitOptions {
      /**
       * Use a file browser mode.
       * Defaults to false.
       */
      browser?: boolean;

      /**
       * Specifies whether hidden files should be displayed when browsing remote files.
       * Note that this is not a security feature, hidden files are always present in the
       * remote file listings received, this option merely controls whether they're displayed or not.
       * Defaults to false.
       */
      show_hidden?: boolean;

      /**
       * Specifies whether the widget allows the user to upload files. If set to false,
       * only existing files may be selected. Note that this is not a security feature.
       * Whether file upload requests are accepted remotely depends on the ACL setup for
       * the current session. This option merely controls whether the upload controls are
       * rendered or not. Defaults to true.
       */
      enable_upload?: boolean;

      /**
       * Specifies whether the widget allows the user to delete remove files. If set to false,
       * existing files may not be removed. Note that this is not a security feature. Whether
       * file delete requests are accepted remotely depends on the ACL setup for the current
       * session. This option merely controls whether the file remove controls are rendered or not.
       * Defaults to true.
       */
      enable_remove?: boolean;

      /**
       * Specifies whether the widget allows the user to create directories.
       * Defaults to false.
       */
      directory_create?: boolean;

      /**
       * Specifies whether the widget shall select directories only instead of files.
       * Defaults to false.
       */
      directory_select?: boolean;

      /**
       * Specifies whether the widget allows the user to download files.
       * Defaults to false.
       */
      enable_download?: boolean;

      /**
       * Specifies the remote directory the upload and file browsing actions take place in.
       * Browsing to directories outside the root directory is prevented by the widget.
       * Note that this is not a security feature. Whether remote directories are browsable
       * or not solely depends on the ACL setup for the current session.
       * Defaults to "/etc/luci-uploads".
       */
      root_directory?: string;
    }
  }

  /**
   * The Hiddenfield class implements an HTML input type="hidden" field which allows to
   * store form data without exposing it to the user.
   *
   * UI widget instances are usually not supposed to be created by view code directly, instead
   * they're implicitly created by LuCI.form when instantiating CBI forms.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Hiddenfield.html
   */
  class Hiddenfield extends AbstractElement {
    /**
     * Instantiate a hidden input field widget.
     * @param value - The initial input value
     * @param options - Object describing the widget specific options to initialize the hidden input
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Hiddenfield.html
     */
    constructor(value?: string | Array<string> | null, options?: AbstractElement.InitOptions);

    /**
     * Read the current value of the input widget.
     * @returns The current value of the input element
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Hiddenfield.html#getValue
     */
    getValue(): string | Array<string> | null;

    /**
     * Set the current value of the input widget.
     * @param value - The value to set the input element to
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Hiddenfield.html#setValue
     */
    setValue(value: string | Array<string> | null): void;

    /**
     * Render the widget, set up event listeners and return resulting markup.
     * @returns Returns a DOM Node or DocumentFragment containing the rendered widget markup
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.Hiddenfield.html#render
     */
    render(): Node;
  }

  /**
   * The RangeSlider class implements a widget which allows the user to set a value
   * from a predefined range.
   *
   * UI widget instances are usually not supposed to be created by view code directly.
   * Instead they're implicitly created by LuCI.form when instantiating CBI forms.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.RangeSlider.html
   */
  class RangeSlider extends AbstractElement {
    /**
     * Instantiate a range slider widget.
     * @param value - The initial value to set the slider handle position
     * @param options - Object describing the widget specific options to initialize the range slider
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.RangeSlider.html
     */
    constructor(value?: string | Array<string> | null, options?: RangeSlider.InitOptions);

    /**
     * Return the value calculated by the calculate function.
     * @returns The calculated value
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.RangeSlider.html#getCalculatedValue
     */
    getCalculatedValue(): number;

    /**
     * Read the current value of the input widget.
     * @returns The current value of the input element
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.RangeSlider.html#getValue
     */
    getValue(): string | Array<string> | null;

    /**
     * Set the current value of the input widget.
     * @param value - The value to set the input element to
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.RangeSlider.html#setValue
     */
    setValue(value: string | Array<string> | null): void;

    /**
     * Render the widget, set up event listeners and return resulting markup.
     * @returns Returns a DOM Node or DocumentFragment containing the rendered widget markup
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.RangeSlider.html#render
     */
    render(): Node;
  }

  namespace RangeSlider {
    /**
     * Initialization options for RangeSlider widgets.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.ui.RangeSlider.html#.InitOptions
     */
    interface InitOptions extends AbstractElement.InitOptions {
      /**
       * Specifies the minimum value of the range.
       * Defaults to 1.
       */
      min?: number;

      /**
       * Specifies the maximum value of the range.
       * Defaults to 100.
       */
      max?: number;

      /**
       * Specifies the step value of the range slider handle.
       * Use "any" for arbitrary precision floating point numbers.
       * Defaults to "1".
       */
      step?: string;

      /**
       * Specifies a suffix string to append to the calculated value output.
       * Defaults to null.
       */
      calcunits?: string | null;

      /**
       * Specifies whether the widget is disabled.
       * Defaults to false.
       */
      disabled?: boolean;
    }
  }
}
