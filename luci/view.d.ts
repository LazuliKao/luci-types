declare namespace LuCI.view {
  /**
   * The load function is invoked before the view is rendered.
   * The invocation of this function is wrapped by Promise.resolve() so it may return Promises if needed.
   * The return value of the function (or the resolved values of the promise returned by it) will be passed as the first argument to render().
   *
   * This function is supposed to be overwritten by subclasses, the default implementation does nothing.
   *
   * @returns May return any value or a Promise resolving to any value.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.view.html#load
   */
  function load(): any | Promise<any>;

  /**
   * The render function is invoked after the load() function and responsible for setting up the view contents.
   * It must return a DOM Node or DocumentFragment holding the contents to insert into the view area.
   * The invocation of this function is wrapped by Promise.resolve() so it may return Promises if needed.
   * The return value of the function (or the resolved values of the promise returned by it) will be inserted into the main content area using dom.append().
   *
   * This function is supposed to be overwritten by subclasses, the default implementation does nothing.
   *
   * @param load_results This function will receive the return value of the view.load() function as first argument.
   * @returns Should return a DOM Node value or a Promise resolving to a Node value.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.view.html#render
   */
  function render(load_results: any | null): Node | Promise<Node>;

  /**
   * The handleSave function is invoked when the user clicks the Save button in the page action footer.
   * The default implementation should be sufficient for most views using form.Map() based forms - it will iterate all forms present in the view and invoke the Map.save() method on each form.
   * Views not using Map instances or requiring other special logic should overwrite handleSave() with a custom implementation.
   * To disable the Save page footer button, views extending this base class should overwrite the handleSave function with null.
   * The invocation of this function is wrapped by Promise.resolve() so it may return Promises if needed.
   *
   * @param ev The DOM event that triggered the function.
   * @returns Any return values of this function are discarded, but passed through Promise.resolve() to ensure that any returned promise runs to completion before the button is re-enabled.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.view.html#handleSave
   */
  function handleSave(ev: Event): any | Promise<any>;

  /**
   * The handleSaveApply function is invoked when the user clicks the Save & Apply button in the page action footer.
   * The default implementation should be sufficient for most views using form.Map() based forms - it will first invoke view.handleSave() and then call ui.changes.apply() to start the modal config apply and page reload flow.
   * Views not using Map instances or requiring other special logic should overwrite handleSaveApply() with a custom implementation.
   * To disable the Save & Apply page footer button, views extending this base class should overwrite the handleSaveApply function with null.
   * The invocation of this function is wrapped by Promise.resolve() so it may return Promises if needed.
   *
   * @param ev The DOM event that triggered the function.
   * @param mode Whether to apply the changes checked.
   * @returns Any return values of this function are discarded, but passed through Promise.resolve() to ensure that any returned promise runs to completion before the button is re-enabled.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.view.html#handleSaveApply
   */
  function handleSaveApply(ev: Event, mode: number): any | Promise<any>;

  /**
   * The handleReset function is invoked when the user clicks the Reset button in the page action footer.
   * The default implementation should be sufficient for most views using form.Map() based forms - it will iterate all forms present in the view and invoke the Map.reset() method on each form.
   * Views not using Map instances or requiring other special logic should overwrite handleReset() with a custom implementation.
   * To disable the Reset page footer button, views extending this base class should overwrite the handleReset function with null.
   * The invocation of this function is wrapped by Promise.resolve() so it may return Promises if needed.
   *
   * @param ev The DOM event that triggered the function.
   * @returns Any return values of this function are discarded, but passed through Promise.resolve() to ensure that any returned promise runs to completion before the button is re-enabled.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.view.html#handleReset
   */
  function handleReset(ev: Event): any | Promise<any>;

  /**
   * Renders a standard page action footer if any of the handleSave(), handleSaveApply() or handleReset() functions are defined.
   * The default implementation should be sufficient for most views - it will render a standard page footer with action buttons labeled Save, Save & Apply and Reset triggering the handleSave(), handleSaveApply() and handleReset() functions respectively.
   * When any of these handle*() functions is overwritten with null by a view extending this class, the corresponding button will not be rendered.
   *
   * @returns Returns a DocumentFragment containing the footer bar with buttons for each corresponding handle*() action or an empty DocumentFragment if all three handle*() methods are overwritten with null.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.view.html#addFooter
   */
  function addFooter(): DocumentFragment;
}
