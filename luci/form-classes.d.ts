/**
 * LuCI form classes type definitions
 * @see https://openwrt.github.io/luci/jsapi/LuCI.form.html
 */

declare namespace LuCI.form {
  /**
   * The `AbstractElement` class serves as an abstract base for the different
   * form elements implemented by `LuCI.form`. It provides the common logic
   * for loading and rendering values, for nesting elements and for defining
   * common properties.
   *
   * This class is private and not directly accessible by user code.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractElement.html
   */
  abstract class AbstractElement {
    /**
     * Add another form element as children to this element.
     *
     * @param obj - The form element to add.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractElement.html#append
     */
    append(obj: AbstractElement): void;

    /**
     * Parse this element's form input.
     *
     * The `parse()` function recursively walks the form element tree and
     * triggers input value reading and validation for each encountered element.
     * Elements which are hidden due to unsatisfied dependencies are skipped.
     *
     * @returns Returns a promise resolving once this element's value and the
     * values of all child elements have been parsed. The returned promise is
     * rejected if any parsed values do not meet the validation constraints of
     * their respective elements.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractElement.html#parse
     */
    parse(): Promise<void>;

    /**
     * Render the form element.
     *
     * The `render()` function recursively walks the form element tree and
     * renders the markup for each element, returning the assembled DOM tree.
     *
     * @returns May return a DOM Node or a promise resolving to a DOM node
     * containing the form element's markup, including the markup of any child
     * elements.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractElement.html#render
     */
    render(): Node | Promise<Node>;

    /**
     * Strip any HTML tags from the given input string, and decode HTML entities.
     *
     * @param s - The input string to clean.
     * @returns The cleaned input string with HTML tags removed, and HTML
     * entities decoded.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractElement.html#stripTags
     */
    stripTags(s: string): string;

    /**
     * Format the given named property as a title string.
     *
     * This function looks up the given named property and formats its value
     * suitable for use as an element caption or description string. It also
     * strips any HTML tags from the result.
     *
     * If the property value is a string, it is passed to `String.format()`
     * along with any additional parameters passed to `titleFn()`.
     *
     * If the property value is a function, it is invoked with any additional
     * `titleFn()` parameters as arguments, and the obtained return value is
     * converted to a string.
     *
     * In all other cases, `null` is returned.
     *
     * @param attr - The name of the element property to use.
     * @param args - Extra values to format the title string with.
     * @returns The formatted title string or `null` if the property did not
     * exist or was neither a string nor a function.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractElement.html#titleFn
     */
    titleFn(attr: string, ...args: string[]): string | null;
  }

  /**
   * Type alias for a class constructor that creates instances of type T.
   * Used for passing class references (not instances) to methods like `option()`.
   */
  type ClassConstructor<T> = new (...args: any[]) => T;

  /**
   * Configuration value type - can be null, a string, an array of strings,
   * or an object mapping option names to their values.
   */
  type ConfigValue =
    | null
    | string
    | string[]
    | { [optionName: string]: null | string | string[] };

  /**
   * The `AbstractSection` class serves as an abstract base for the different
   * form section styles implemented by `LuCI.form`. It provides the common
   * logic for enumerating underlying configuration section instances, for
   * registering form options and for handling tabs in order to segment child
   * options.
   *
   * This class is private and not directly accessible by user code.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractSection.html
   */
  abstract class AbstractSection extends AbstractElement {
    /**
     * The section type string, e.g. "interface", "dhcp", etc.
     * Used to filter UCI sections by type.
     */
    sectiontype: string;

    /**
     * Reference to the parent Map instance containing this section.
     */
    map: Map;

    /**
     * The UCI configuration name this section belongs to.
     */
    config: string;

    /**
     * Whether this section is optional. When `true`, the section may be
     * omitted from the configuration.
     */
    optional: boolean | undefined;

    /**
     * Whether add/remove buttons should be shown for this section.
     * When `true`, users can add new sections or remove existing ones.
     */
    addremove: boolean | undefined;

    /**
     * Whether this section type supports dynamic addition of options.
     */
    dynamic: boolean | undefined;

    /**
     * Whether section names should be hidden from the user interface.
     * When `true`, sections are displayed without their names.
     */
    anonymous: boolean | undefined;

    /**
     * Whether sections can be reordered by drag-and-drop.
     */
    sortable: boolean | undefined;

    /**
     * Whether sections can be cloned/duplicated.
     */
    cloneable: boolean | undefined;

    /**
     * Access the parent option container instance.
     *
     * In case this section is nested within an option element container,
     * this property will hold a reference to the parent option instance.
     *
     * If this section is not nested, the property is `null`.
     *
     * @readonly
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractSection.html#parentoption
     */
    readonly parentoption: AbstractValue | null;

    /**
     * Enumerate the UCI section IDs covered by this form section element.
     *
     * @returns Returns an array of UCI section IDs covered by this form element.
     * The sections will be rendered in the same order as the returned array.
     * @throws {InternalError} Throws an `InternalError` exception if the
     * function is not implemented.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractSection.html#cfgsections
     */
    abstract cfgsections(): string[];

    /**
     * Filter UCI section IDs to render.
     *
     * The filter function is invoked for each UCI section ID of a given type
     * and controls whether the given UCI section is rendered or ignored by
     * the form section element.
     *
     * The default implementation always returns `true`. User code or classes
     * extending `AbstractSection` may override this function with custom
     * implementations.
     *
     * @param section_id - The UCI section ID to test.
     * @returns Returns `true` when the given UCI section ID should be handled
     * and `false` when it should be ignored.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractSection.html#filter
     */
    filter(section_id: string): boolean;

    /**
     * Load the configuration covered by this section.
     *
     * The `load()` function recursively walks the section element tree and
     * invokes the load function of each child option element.
     *
     * @returns Returns a promise resolving once the values of all child
     * elements have been loaded. The promise may reject with an error if any
     * of the child elements' load functions rejected with an error.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractSection.html#load
     */
    load(): Promise<void>;

    /**
     * Parse this section's form input.
     *
     * The `parse()` function recursively walks the section element tree and
     * triggers input value reading and validation for each encountered child
     * option element. Options which are hidden due to unsatisfied dependencies
     * are skipped.
     *
     * @returns Returns a promise resolving once the values of all child
     * elements have been parsed. The returned promise is rejected if any
     * parsed values do not meet the validation constraints of their
     * respective elements.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractSection.html#parse
     * @override
     */
    parse(): Promise<void>;

    /**
     * Add an option tab to the section.
     *
     * The child option elements of a section may be divided into multiple
     * tabs to provide a better overview to the user.
     *
     * Before options can be moved into a tab pane, the corresponding tab has
     * to be defined first, which is done by calling this function.
     *
     * Note that once tabs are defined, user code must use the `taboption()`
     * method to add options to specific tabs. Option elements added by
     * `option()` will not be assigned to any tab and not be rendered in this
     * case.
     *
     * @param name - The name of the tab to register. It may be freely chosen
     * and just serves as an identifier to differentiate tabs.
     * @param title - The human readable caption of the tab.
     * @param description - An additional description text for the corresponding
     * tab pane. It is displayed as a text paragraph below the tab but before
     * the tab pane contents. If omitted, no description will be rendered.
     * @throws {Error} Throws an exception if a tab with the same `name`
     * already exists.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractSection.html#tab
     */
    tab(name: string, title: string, description?: string): void;

    /**
     * Add a configuration option widget to the section.
     *
     * Note that `taboption()` should be used instead if this form section
     * element uses tabs.
     *
     * @typeParam T - The type of AbstractValue subclass being instantiated.
     * @param optionclass - The option class to use for rendering the
     * configuration option. Note that this value must be the class itself,
     * not a class instance obtained from calling `new`. It must also be a
     * class derived from `AbstractValue`.
     * @param args - Additional arguments which are passed as-is to the
     * constructor of the given option class. Refer to the class specific
     * constructor documentation for details.
     * @returns Returns the instantiated option class instance.
     * @throws {TypeError} Throws a `TypeError` exception in case the passed
     * class value is not a descendant of `AbstractValue`.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractSection.html#option
     */
    option<T extends AbstractValue>(
      optionclass: ClassConstructor<T>,
      ...args: any[]
    ): T;

    /**
     * Add a configuration option widget to a tab of the section.
     *
     * @typeParam T - The type of AbstractValue subclass being instantiated.
     * @param tabName - The name of the section tab to add the option element to.
     * @param optionclass - The option class to use for rendering the
     * configuration option. Note that this value must be the class itself,
     * not a class instance obtained from calling `new`. It must also be a
     * class derived from `AbstractValue`.
     * @param args - Additional arguments which are passed as-is to the
     * constructor of the given option class. Refer to the class specific
     * constructor documentation for details.
     * @returns Returns the instantiated option class instance.
     * @throws {ReferenceError} Throws a `ReferenceError` exception when the
     * given tab name does not exist.
     * @throws {TypeError} Throws a `TypeError` exception in case the passed
     * class value is not a descendant of `AbstractValue`.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractSection.html#taboption
     */
    taboption<T extends AbstractValue>(
      tabName: string,
      optionclass: ClassConstructor<T>,
      ...args: any[]
    ): T;

    /**
     * Query underlying option configuration values.
     *
     * This function is sensitive to the amount of arguments passed to it;
     * if only one argument is specified, the configuration values of all
     * options within this section are returned as a dictionary.
     *
     * If both the section ID and an option name are supplied, this function
     * returns the configuration value of the specified option only.
     *
     * @param section_id - The configuration section ID.
     * @param option - The name of the option to query.
     * @returns Returns either a dictionary of option names and their
     * corresponding configuration values or just a single configuration value,
     * depending on the amount of passed arguments.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractSection.html#cfgvalue
     */
    cfgvalue(section_id: string, option?: string): ConfigValue;

    /**
     * Query the underlying option widget input values.
     *
     * This function is sensitive to the amount of arguments passed to it;
     * if only one argument is specified, the widget input values of all
     * options within this section are returned as a dictionary.
     *
     * If both the section ID and an option name are supplied, this function
     * returns the widget input value of the specified option only.
     *
     * @param section_id - The configuration section ID.
     * @param option - The name of the option to query.
     * @returns Returns either a dictionary of option names and their
     * corresponding widget input values or just a single widget input value,
     * depending on the amount of passed arguments.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractSection.html#formvalue
     */
    formvalue(section_id: string, option?: string): ConfigValue;

    /**
     * Obtain underlying option LuCI.ui widget instances.
     *
     * This function is sensitive to the amount of arguments passed to it;
     * if only one argument is specified, the LuCI.ui widget instances of
     * all options within this section are returned as a dictionary.
     *
     * If both the section ID and an option name are supplied, this function
     * returns the LuCI.ui widget instance value of the specified option only.
     *
     * @param section_id - The configuration section ID.
     * @param option - The name of the option to query.
     * @returns Returns either a dictionary of option names and their
     * corresponding widget instances or just a single widget instance,
     * depending on the amount of passed arguments.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractSection.html#getUIElement
     */
    getUIElement(
      section_id: string,
      option?: string
    ):
      | null
      | LuCI.ui.AbstractElement
      | { [optionName: string]: null | LuCI.ui.AbstractElement };

    /**
     * Obtain underlying option objects.
     *
     * This function is sensitive to the amount of arguments passed to it;
     * if no option name is specified, all options within this section are
     * returned as a dictionary.
     *
     * If an option name is supplied, this function returns the matching
     * AbstractValue instance only.
     *
     * @param option - The name of the option object to obtain.
     * @returns Returns either a dictionary of option names and their
     * corresponding option instance objects or just a single object instance,
     * depending on the amount of passed arguments.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractSection.html#getOption
     */
    getOption(
      option?: string
    ): null | AbstractValue | { [optionName: string]: AbstractValue };
  }

  // ============================================================================
  // Value Classes (AbstractValue and subclasses)
  // ============================================================================

  /**
   * The `AbstractValue` class serves as an abstract base for the different
   * form option styles implemented by `LuCI.form`. It provides the common
   * logic for handling option input values, for dependencies among options
   * and for validation constraints that should be applied to entered values.
   *
   * This class is private and not directly accessible by user code.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html
   */
  abstract class AbstractValue extends AbstractElement {
    /**
     * If set to `false`, the underlying option value is retained upon saving
     * the form when the option element is disabled due to unsatisfied
     * dependency constraints.
     *
     * @default true
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#rmempty
     */
    rmempty: boolean;

    /**
     * If set to `true`, the underlying ui input widget is allowed to be empty,
     * otherwise the option element is marked invalid when no value is entered
     * or selected by the user.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#optional
     */
    optional: boolean;

    /**
     * If set to `true`, the underlying ui input widget value is not cleared
     * from the configuration on unsatisfied dependencies. The default behavior
     * is to remove the values of all options whose dependencies are not fulfilled.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#retain
     */
    retain: boolean;

    /**
     * Sets a default value to use when the underlying UCI option is not set.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#default
     */
    default: unknown;

    /**
     * Specifies a datatype constraint expression to validate input values
     * against. Refer to `LuCI.validation` for details on the format.
     *
     * If the user entered input does not match the datatype validation,
     * the option element is marked as invalid.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#datatype
     */
    datatype: string;

    /**
     * Specifies a custom validation function to test the user input for validity.
     * The validation function must return `true` to accept the value. Any other
     * return value type is converted to a string and displayed to the user as
     * a validation error message.
     *
     * If the user entered input does not pass the validation function, the
     * option element is marked as invalid.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#validate
     */
    validate: (section_id: string, value: unknown) => boolean | string;

    /**
     * Override the UCI configuration name to read the option value from.
     * By default, the configuration name is inherited from the parent Map.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#uciconfig
     */
    uciconfig: string;

    /**
     * Override the UCI section name to read the option value from.
     * By default, the section ID is inherited from the parent section element.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#ucisection
     */
    ucisection: string;

    /**
     * Override the UCI option name to read the value from.
     * By default, the elements name, which is passed as the third argument
     * to the constructor, is used as the UCI option name.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#ucioption
     */
    ucioption: string;

    /**
     * Mark the grid section option element as editable.
     *
     * Options which are displayed in the table portion of a `GridSection`
     * instance are rendered as readonly text by default. By setting the
     * `editable` property of a child option element to `true`, that element
     * is rendered as a full input widget within its cell instead of a text
     * only preview.
     *
     * This property has no effect on options that are not children of grid
     * section elements.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#editable
     */
    editable: boolean;

    /**
     * Move the grid section option element into the table, the modal popup or both.
     *
     * If this property is `null` (the default), the option element is displayed
     * in both the table preview area and the per-section instance modal popup
     * of a grid section. When it is set to `false` the option is only shown in
     * the table but not the modal popup. When set to `true`, the option is only
     * visible in the modal popup but not the table.
     *
     * This property has no effect on options that are not children of grid
     * section elements.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#modalonly
     */
    modalonly: boolean | null;

    /**
     * Make option element readonly.
     *
     * This property defaults to the readonly state of the parent form element.
     * When set to `true`, the underlying widget is rendered in disabled state,
     * meaning its contents cannot be changed and the widget cannot be interacted
     * with.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#readonly
     */
    readonly: boolean;

    /**
     * Override the cell width of a table or grid section child option.
     *
     * If the property is set to a numeric value, it is treated as pixel width
     * which is set on the containing cell element of the option, essentially
     * forcing a certain column width. When the property is set to a string
     * value, it is applied as-is to the CSS `width` property.
     *
     * This property has no effect on options that are not children of grid or
     * table section elements.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#width
     */
    width: number | string;

    /**
     * Register a custom value change handler.
     *
     * If this property is set to a function, it is invoked whenever the value
     * of the underlying UI input element changes. The invoked handler function
     * will receive the DOM click element as first and the underlying
     * configuration section ID as well as the input value as second and third
     * argument respectively.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#onchange
     */
    onchange: (ev: Element, section_id: string, value: unknown) => void;

    /**
     * Obtain the internal ID ("cbid") of the element instance.
     *
     * Since each form section element may map multiple underlying configuration
     * sections, the configuration section ID is required to form a fully
     * qualified ID pointing to the specific element instance within the given
     * specific section.
     *
     * @param section_id - The configuration section ID.
     * @returns Returns the element ID.
     * @throws {TypeError} Throws a `TypeError` exception when no `section_id`
     * was specified.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#cbid
     */
    cbid(section_id: string): string;

    /**
     * Load the underlying configuration value.
     *
     * The default implementation of this method reads and returns the underlying
     * UCI option value (or the related JavaScript property for `JSONMap` instances).
     * It may be overridden by user code to load data from non-standard sources.
     *
     * @param section_id - The configuration section ID.
     * @returns Returns the configuration value to initialize the option element
     * with. The return value of this function is filtered through `Promise.resolve()`
     * so it may return promises if overridden by user code.
     * @throws {TypeError} Throws a `TypeError` exception when no `section_id`
     * was specified.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#load
     */
    load(section_id: string): unknown | Promise<unknown>;

    /**
     * Query the underlying configuration value.
     *
     * The default implementation of this method returns the cached return value
     * of `load()`. It may be overridden by user code to obtain the configuration
     * value in a different way.
     *
     * @param section_id - The configuration section ID.
     * @param set_value - The value to assign.
     * @returns Returns the configuration value.
     * @throws {TypeError} Throws a `TypeError` exception when no `section_id`
     * was specified.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#cfgvalue
     */
    cfgvalue(section_id: string, set_value?: string): unknown;

    /**
     * Query the current form input value.
     *
     * The default implementation of this method returns the current input value
     * of the underlying `LuCI.ui` widget. It may be overridden by user code to
     * handle input values differently.
     *
     * @param section_id - The configuration section ID.
     * @returns Returns the current input value.
     * @throws {TypeError} Throws a `TypeError` exception when no `section_id`
     * was specified.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#formvalue
     */
    formvalue(section_id: string): unknown;

    /**
     * Obtain a textual input representation.
     *
     * The default implementation of this method returns the HTML-escaped current
     * input value of the underlying `LuCI.ui` widget. User code or specific option
     * element implementations may override this function to apply a different logic,
     * e.g. to return `Yes` or `No` depending on the checked state of checkbox elements.
     *
     * @param section_id - The configuration section ID.
     * @returns Returns the text representation of the current input value.
     * @throws {TypeError} Throws a `TypeError` exception when no `section_id`
     * was specified.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#textvalue
     */
    textvalue(section_id: string): string;

    /**
     * Obtain the underlying `LuCI.ui` element instance.
     *
     * @param section_id - The configuration section ID.
     * @returns Returns the `LuCI.ui` element instance or `null` in case the form
     * option implementation does not use `LuCI.ui` widgets.
     * @throws {TypeError} Throws a `TypeError` exception when no `section_id`
     * was specified.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#getUIElement
     */
    getUIElement(section_id: string): LuCI.ui.AbstractElement | null;

    /**
     * Apply custom validation logic.
     *
     * This method is invoked whenever incremental validation is performed on
     * the user input, e.g. on keyup or blur events. The default implementation
     * of this method does nothing and always returns `true`. User code may
     * override this method to provide additional validation logic which is not
     * covered by data type constraints.
     *
     * @param section_id - The configuration section ID.
     * @param value - The value to validate.
     * @returns The method shall return `true` to accept the given value. Any
     * other return value is treated as a failure, converted to a string and
     * displayed as an error message to the user.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#validate
     */
    validate(section_id: string, value: unknown): boolean | string;

    /**
     * Test whether the input value is currently valid.
     *
     * @param section_id - The configuration section ID.
     * @returns Returns `true` if the input value currently is valid, otherwise
     * it returns `false`.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#isValid
     */
    isValid(section_id: string): boolean;

    /**
     * Returns the current validation error for this input.
     *
     * @param section_id - The configuration section ID.
     * @returns The validation error at this time.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#getValidationError
     */
    getValidationError(section_id: string): string;

    /**
     * Test whether the option element is currently active.
     *
     * An element is active when it is not hidden due to unsatisfied dependency
     * constraints.
     *
     * @param section_id - The configuration section ID.
     * @returns Returns `true` if the option element currently is active,
     * otherwise it returns `false`.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#isActive
     */
    isActive(section_id: string): boolean;

    /**
     * Add a dependency constraint to the option.
     *
     * Dependency constraints allow making the presence of option elements
     * dependent on the current values of certain other options within the
     * same form. An option element with unsatisfied dependencies will be
     * hidden from the view and its current value omitted when saving.
     *
     * Multiple constraints (that is, multiple calls to `depends()`) are
     * treated as alternatives, forming a logical "or" expression. By passing
     * an object of name => value pairs as the first argument, it is possible
     * to depend on multiple options simultaneously, forming a logical "and"
     * expression.
     *
     * Option names may be given in "dot notation" which allows referencing
     * option elements outside the current form section. If a name without a
     * dot is specified, it refers to an option within the same configuration
     * section. If specified as `configname.sectionid.optionname`, options
     * anywhere within the same form may be specified.
     *
     * The object notation also allows for a number of special keys which are
     * not treated as option names but as modifiers to influence the dependency
     * constraint evaluation. The associated value of these special "tag" keys
     * is ignored. The recognized tags are:
     *
     * - `!reverse` - Invert the dependency, instead of requiring another option
     *   to be equal to the dependency value, that option should *not* be equal.
     * - `!contains` - Instead of requiring an exact match, the dependency is
     *   considered satisfied when the dependency value is contained within the
     *   option value.
     * - `!default` - The dependency is always satisfied
     *
     * @param field - The name of the option to depend on or an object
     * describing multiple dependencies which must be satisfied (a logical
     * "and" expression).
     * @param value - When invoked with a plain option name as the first
     * argument, this parameter specifies the expected value. In case an object
     * is passed as the first argument, this parameter is ignored.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#depends
     */
    depends(
      field: string | Record<string, string | RegExp>,
      value?: string | RegExp
    ): void;

    /**
     * Write the current input value into the configuration.
     *
     * This function is invoked upon saving the parent form when the option
     * element is valid and when its input value has been changed compared to
     * the initial value returned by `cfgvalue()`.
     *
     * The default implementation simply sets the given input value in the UCI
     * configuration (or the associated JavaScript object property in case of
     * `JSONMap` forms). It may be overridden by user code to implement
     * alternative save logic, e.g. to transform the input value before it is
     * written.
     *
     * @param section_id - The configuration section ID.
     * @param formvalue - The input value to write.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#write
     */
    write(section_id: string, formvalue: string | string[]): null;

    /**
     * Remove the corresponding value from the configuration.
     *
     * This function is invoked upon saving the parent form when the option
     * element has been hidden due to unsatisfied dependencies or when the
     * user cleared the input value and the option is marked optional.
     *
     * The default implementation simply removes the associated option from
     * the UCI configuration (or the associated JavaScript object property
     * in case of `JSONMap` forms). It may be overridden by user code to
     * implement alternative removal logic, e.g. to retain the original value.
     *
     * @param section_id - The configuration section ID.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#remove
     */
    remove(section_id: string): void;

    /**
     * Parse the option element input.
     *
     * The function is invoked when the `parse()` method has been invoked on
     * the parent form and triggers input value reading and validation.
     *
     * @param section_id - The configuration section ID.
     * @returns Returns a promise resolving once the input value has been read
     * and validated or rejecting in case the input value does not meet the
     * validation constraints.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.AbstractValue.html#parse
     */
    parse(section_id: string): Promise<void>;
  }

  /**
   * The `Value` class represents a simple one-line form input using the
   * `LuCI.ui.Textfield` or - in case choices are added - the `LuCI.ui.Combobox`
   * class as underlying widget.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Value.html
   */
  class Value extends AbstractValue {
    /**
     * If set to `true`, the field is rendered as a password input, otherwise
     * as a plain text input.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Value.html#password
     */
    password: boolean;

    /**
     * Set a placeholder string to use when the input field is empty.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Value.html#placeholder
     */
    placeholder: string;

    /**
     * Add a predefined choice to the form option.
     *
     * By adding one or more choices, the plain text input field is turned into
     * a combobox widget which prompts the user to select a predefined choice,
     * or to enter a custom value.
     *
     * @param key - The choice value to add.
     * @param val - The caption for the choice value. May be a DOM node, a
     * document fragment or a plain text string. If omitted, the `key` value
     * is used as a caption.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Value.html#value
     */
    value(key: string, val?: Node | string): void;

    /**
     * Render the form element.
     *
     * The `render()` function recursively walks the form element tree and
     * renders the markup for each element, returning the assembled DOM tree.
     *
     * @returns May return a DOM Node or a promise resolving to a DOM node
     * containing the form element's markup, including the markup of any child
     * elements.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Value.html#render
     */
    render(): Node | Promise<Node>;
  }

  /**
   * The `TextValue` class implements a multi-line textarea input using
   * `LuCI.ui.Textarea`.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TextValue.html
   */
  class TextValue extends Value {
    /**
     * Enforces the use of a monospace font for the textarea contents when
     * set to `true`.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TextValue.html#monospace
     */
    monospace: boolean;

    /**
     * Allows specifying the `cols` property of the underlying textarea widget.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TextValue.html#cols
     */
    cols: number;

    /**
     * Allows specifying the `rows` property of the underlying textarea widget.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TextValue.html#rows
     */
    rows: number;

    /**
     * Allows specifying the `wrap` property of the underlying textarea widget.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TextValue.html#wrap
     */
    wrap: number;
  }

  /**
   * The `Flag` element builds upon the `LuCI.ui.Checkbox` widget to implement
   * a simple checkbox element.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Flag.html
   */
  class Flag extends Value {
    /**
     * Sets the input value to use for the checkbox checked state.
     *
     * @default '1'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Flag.html#enabled
     */
    enabled: string;

    /**
     * Sets the input value to use for the checkbox unchecked state.
     *
     * @default '0'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Flag.html#disabled
     */
    disabled: string;

    /**
     * Set a tooltip for the flag option.
     *
     * Set to a string, it will be used as-is as a tooltip. Set to a function,
     * the function will be invoked and the return value will be shown as a
     * tooltip. If the return value of the function is `null` no tooltip will
     * be set.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Flag.html#tooltip
     */
    tooltip: string | (() => string | null);

    /**
     * Set a tooltip icon for the flag option.
     *
     * If set, this icon will be shown for the default one. This could also
     * be a png icon from the resources directory.
     *
     * @default 'ℹ️'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Flag.html#tooltipicon
     */
    tooltipicon: string;

    /**
     * Query the checked state of the underlying checkbox widget and return
     * either the `enabled` or the `disabled` property value, depending on
     * the checked state.
     *
     * @param section_id - The configuration section ID.
     * @returns Returns the current input value.
     * @throws {TypeError} Throws a `TypeError` exception when no `section_id`
     * was specified.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Flag.html#formvalue
     */
    formvalue(section_id: string): unknown;

    /**
     * Query the checked state of the underlying checkbox widget and return
     * either a localized `Yes` or `No` string, depending on the checked state.
     *
     * @param section_id - The configuration section ID.
     * @returns Returns the text representation of the current input value.
     * @throws {TypeError} Throws a `TypeError` exception when no `section_id`
     * was specified.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Flag.html#textvalue
     */
    textvalue(section_id: string): string;
  }

  /**
   * The `ListValue` class implements a simple static HTML select element
   * allowing the user to choose a single value from a set of predefined
   * choices. It builds upon the `LuCI.ui.Select` widget.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.ListValue.html
   */
  class ListValue extends Value {
    /**
     * Set the size attribute of the underlying HTML select element.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.ListValue.html#size
     */
    size: number;

    /**
     * Set the type of the underlying form controls.
     *
     * May be one of `select` or `radio`. If set to `select`, an HTML select
     * element is rendered, otherwise a collection of `radio` elements is used.
     *
     * @default 'select'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.ListValue.html#widget
     */
    widget: 'select' | 'radio';

    /**
     * Set the orientation of the underlying radio or checkbox elements.
     *
     * May be one of `horizontal` or `vertical`. Only applies to non-select
     * widget types.
     *
     * @default 'horizontal'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.ListValue.html#orientation
     */
    orientation: 'horizontal' | 'vertical';
  }

  /**
   * The `DynamicList` class represents a multi-value widget allowing the user
   * to enter multiple unique values, optionally selected from a set of
   * predefined choices. It builds upon the `LuCI.ui.DynamicList` widget.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.DynamicList.html
   */
  class DynamicList extends Value {
    /**
     * Allows the underlying form controls to have multiple identical values.
     *
     * Default is `null`. If `true`, the underlying form value will not be
     * checked for duplication.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.DynamicList.html#allowduplicates
     */
    allowduplicates: boolean;
  }

  /**
   * The `Button` element wraps a `LuCI.ui.Hiddenfield` widget and renders
   * the underlying UCI option or default value as readonly text.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Button.html
   */
  class Button extends Value {
    /**
     * Override the rendered button caption.
     *
     * By default, the option title - which is passed as the fourth argument
     * to the constructor - is used as a caption for the button element.
     *
     * When setting this property to a string, it is used as a `String.format()`
     * pattern with the underlying UCI section name passed as the first format
     * argument.
     *
     * When set to a function, it is invoked passing the section ID as the sole
     * argument, and the resulting return value is converted to a string before
     * being used as a button caption.
     *
     * The default of `null` means the option title is used as caption.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Button.html#inputtitle
     */
    inputtitle: string | ((section_id: string) => string);

    /**
     * Override the button style class.
     *
     * By setting this property, a specific `cbi-button-*` CSS class can be
     * selected to influence the style of the resulting button. Suitable values
     * which are implemented by most themes are `positive`, `negative` and
     * `primary`.
     *
     * The default of `null` means a neutral button styling is used.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Button.html#inputstyle
     */
    inputstyle: string;

    /**
     * Override the button click action.
     *
     * By default, the underlying UCI option (or default property) value is
     * copied into a hidden field tied to the button element and the save
     * action is triggered on the parent form element.
     *
     * When this property is set to a function, it is invoked instead of
     * performing the default actions. The handler function will receive the
     * DOM click element as the first and the underlying configuration section
     * ID as the second argument.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Button.html#onclick
     */
    onclick: (ev: Element, section_id: string) => void;
  }

  /**
   * The `DummyValue` element wraps a `LuCI.ui.Hiddenfield` widget and renders
   * the underlying UCI option or default value as readonly text.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.DummyValue.html
   */
  class DummyValue extends Value {
    /**
     * Set a URL which is opened when clicking on the dummy value text.
     *
     * By setting this property, the dummy value text is wrapped in an `<a>`
     * element with the property value used as `href` attribute.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.DummyValue.html#href
     */
    href: string;

    /**
     * Treat the UCI option value (or the `default` property value) as HTML.
     *
     * By default, the value text is HTML escaped before being rendered as text.
     * In some cases, HTML content may need to be interpreted and rendered as-is.
     * When set to `true`, HTML escaping is disabled.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.DummyValue.html#rawhtml
     */
    rawhtml: boolean;

    /**
     * Render the UCI option value as hidden using the HTML 'display: none'
     * style property. By default, the value is displayed.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.DummyValue.html#hidden
     */
    hidden: boolean;
  }

  /**
   * The `HiddenValue` element wraps a `LuCI.ui.Hiddenfield` widget.
   *
   * Hidden value widgets used to be necessary in legacy code which actually
   * submitted the underlying HTML form the server. With client side handling
   * of forms, there are more efficient ways to store hidden state data.
   *
   * Since this widget has no visible content, the title and description values
   * of this form element should be set to `null` as well to avoid a broken or
   * distorted form layout when rendering the option element.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.HiddenValue.html
   */
  class HiddenValue extends Value {}

  /**
   * The `FileUpload` element wraps a `LuCI.ui.FileUpload` widget and offers
   * the ability to browse, upload and select remote files.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.FileUpload.html
   */
  class FileUpload extends Value {
    /**
     * Render the widget in browser mode initially instead of a button to
     * 'Select File...'.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.FileUpload.html#browser
     */
    browser: boolean;

    /**
     * Toggle display of hidden files.
     *
     * Display hidden files when rendering the remote directory listing.
     * Note that this is merely a cosmetic feature: hidden files are always
     * included in received remote file listings.
     *
     * The default of `false` means hidden files are not displayed.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.FileUpload.html#show_hidden
     */
    show_hidden: boolean;

    /**
     * Toggle file upload functionality.
     *
     * When set to `true`, the underlying widget provides a button which lets
     * the user select and upload local files to the remote system.
     *
     * Note that this is merely a cosmetic feature: remote upload access is
     * controlled by the session ACL rules.
     *
     * The default of `true` means file upload functionality is displayed.
     *
     * @default true
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.FileUpload.html#enable_upload
     */
    enable_upload: boolean;

    /**
     * Toggle remote directory create functionality.
     *
     * When set to `true`, the underlying widget provides a button which lets
     * the user create directories.
     *
     * Note that this is merely a cosmetic feature: remote create permissions
     * are controlled by the session ACL rules.
     *
     * The default of `false` means the directory create button is hidden.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.FileUpload.html#directory_create
     */
    directory_create: boolean;

    /**
     * Toggle remote directory select functionality.
     *
     * When set to `true`, the underlying widget changes behaviour to select
     * directories instead of files, in effect, becoming a directory picker.
     *
     * The default is `false`.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.FileUpload.html#directory_select
     */
    directory_select: boolean;

    /**
     * Toggle remote file delete functionality.
     *
     * When set to `true`, the underlying widget provides buttons which let
     * the user delete files from remote directories.
     *
     * Note that this is merely a cosmetic feature: remote delete permissions
     * are controlled by the session ACL rules.
     *
     * The default is `true`, means file removal buttons are displayed.
     *
     * @default true
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.FileUpload.html#enable_remove
     */
    enable_remove: boolean;

    /**
     * Toggle download file functionality.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.FileUpload.html#enable_download
     */
    enable_download: boolean;

    /**
     * Specify the root directory for file browsing.
     *
     * This property defines the topmost directory the file browser widget
     * may navigate to. The UI will not allow browsing directories outside
     * this prefix.
     *
     * Note that this is merely a cosmetic feature: remote file access and
     * directory listing permissions are controlled by the session ACL rules.
     *
     * The default is `/etc/luci-uploads`.
     *
     * @default '/etc/luci-uploads'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.FileUpload.html#root_directory
     */
    root_directory: string;
  }

  /**
   * The `DirectoryPicker` element wraps a `LuCI.ui.FileUpload` widget and
   * offers the ability to browse, create, delete and select remote directories.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.DirectoryPicker.html
   */
  class DirectoryPicker extends Value {
    /**
     * Render the widget in browser mode initially instead of a button to
     * 'Select Directory...'.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.DirectoryPicker.html#browser
     */
    browser: boolean;

    /**
     * Toggle display of hidden files.
     *
     * Display hidden files when rendering the remote directory listing.
     * Note that this is merely a cosmetic feature: hidden files are always
     * included in received remote file listings.
     *
     * The default of `true` means hidden files are displayed.
     *
     * @default true
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.DirectoryPicker.html#show_hidden
     */
    show_hidden: boolean;

    /**
     * Toggle file upload functionality.
     *
     * When set to `true`, the underlying widget provides a button which lets
     * the user select and upload local files to the remote system.
     *
     * Note that this is merely a cosmetic feature: remote upload access is
     * controlled by the session ACL rules.
     *
     * The default of `false` means file upload functionality is disabled.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.DirectoryPicker.html#enable_upload
     */
    enable_upload: boolean;

    /**
     * Toggle remote directory create functionality.
     *
     * When set to `true`, the underlying widget provides a button which lets
     * the user create directories.
     *
     * Note that this is merely a cosmetic feature: remote create permissions
     * are controlled by the session ACL rules.
     *
     * The default of `false` means the directory create button is hidden.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.DirectoryPicker.html#directory_create
     */
    directory_create: boolean;

    /**
     * Toggle remote file delete functionality.
     *
     * When set to `true`, the underlying widget provides buttons which let
     * the user delete files from remote directories.
     *
     * Note that this is merely a cosmetic feature: remote delete permissions
     * are controlled by the session ACL rules.
     *
     * The default is `false`, means file removal buttons are not displayed.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.DirectoryPicker.html#enable_remove
     */
    enable_remove: boolean;

    /**
     * Toggle download file functionality.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.DirectoryPicker.html#enable_download
     */
    enable_download: boolean;

    /**
     * Specify the root directory for file browsing.
     *
     * This property defines the topmost directory the file browser widget
     * may navigate to. The UI will not allow browsing directories outside
     * this prefix.
     *
     * Note that this is merely a cosmetic feature: remote file access and
     * directory listing permissions are controlled by the session ACL rules.
     *
     * The default is `/tmp`.
     *
     * @default '/tmp'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.DirectoryPicker.html#root_directory
     */
    root_directory: string;
  }

  /**
   * The `RangeSliderValue` class implements a range slider input using
   * `LuCI.ui.RangeSlider`. It is useful in cases where a value shall fall
   * within a predetermined range. This helps omit various error checks for
   * such values. The currently chosen value is displayed to the side of the
   * slider.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.RangeSliderValue.html
   */
  class RangeSliderValue extends Value {
    /**
     * Minimum value the slider can represent.
     *
     * @default 0
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.RangeSliderValue.html#min
     */
    min: number;

    /**
     * Maximum value the slider can represent.
     *
     * @default 100
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.RangeSliderValue.html#max
     */
    max: number;

    /**
     * Step size for each tick of the slider, or the special value "any"
     * when handling arbitrary precision floating point numbers.
     *
     * @default '1'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.RangeSliderValue.html#step
     */
    step: string;

    /**
     * Set the default value for the slider.
     *
     * The default value is elided during save: meaning, a currently chosen
     * value which matches the default is not saved.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.RangeSliderValue.html#default
     */
    default: string;

    /**
     * Override the calculate action.
     *
     * When this property is set to a function, it is invoked when the slider
     * is adjusted. This might be useful to calculate and display a result
     * which is more meaningful than the currently chosen value.
     *
     * The calculated value is displayed below the slider.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.RangeSliderValue.html#calculate
     */
    calculate: (value: number) => number | string;

    /**
     * Define the units of the calculated value.
     *
     * Suffix a unit string to the calculated value, e.g. 'seconds' or 'dBm'.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.RangeSliderValue.html#calcunits
     */
    calcunits: string;

    /**
     * Query the current form input value.
     *
     * @param section_id - The configuration section ID.
     * @returns Returns the currently selected value if it does not match the
     * default. If the currently selected value matches the default value,
     * returns null.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.RangeSliderValue.html#formvalue
     */
    formvalue(section_id: string): unknown;
  }

  /**
   * The `RichListValue` class implements a simple static HTML select element
   * allowing the user to choose a single value from a set of predefined
   * choices. Each choice may contain a tertiary, more elaborate description.
   * It builds upon the `LuCI.form.ListValue` widget.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.RichListValue.html
   */
  class RichListValue extends ListValue {
    /**
     * Set the orientation of the underlying radio or checkbox elements.
     *
     * May be one of `horizontal` or `vertical`. Only applies to non-select
     * widget types.
     *
     * @default 'horizontal'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.RichListValue.html#orientation
     */
    orientation: 'horizontal' | 'vertical';

    /**
     * Set the size attribute of the underlying HTML select element.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.RichListValue.html#size
     */
    size: number;

    /**
     * Set the type of the underlying form controls.
     *
     * May be one of `select` or `radio`. If set to `select`, an HTML select
     * element is rendered, otherwise a collection of `radio` elements is used.
     *
     * @default 'select'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.RichListValue.html#widget
     */
    widget: 'select' | 'radio';

    /**
     * Add a predefined choice to the form option.
     *
     * By adding one or more choices, the plain text input field is turned into
     * a combobox widget which prompts the user to select a predefined choice,
     * or to enter a custom value.
     *
     * @param value - The choice value to add.
     * @param title - The caption for the choice value. May be a DOM node, a
     * document fragment or a plain text string. If omitted, the `key` value
     * is used as caption.
     * @param description - The description text of the choice value. May be a
     * DOM node, a document fragment or a plain text string. If omitted, the
     * value element is implemented as a simple ListValue entry.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.RichListValue.html#value
     */
    value(value: string, title?: Node | string, description?: Node | string): void;
  }

  /**
   * The `Map` class represents one complete form. A form usually maps one UCI
   * configuration file and is divided into multiple sections containing multiple
   * fields each. It serves as the main entry point into the `LuCI.form` for
   * typical view code.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Map.html
   */
  class Map extends AbstractElement {
    /**
     * Toggle readonly state of the form.
     *
     * If set to `true`, the Map instance is marked readonly and any form option
     * elements added to it will inherit the readonly state.
     *
     * If left unset, the Map will test the access permission of the primary uci
     * configuration upon loading and mark the form readonly if no write
     * permissions are granted.
     *
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Map.html#readonly
     */
    readonly: boolean;

    /**
     * Create a new Map instance.
     *
     * @param config - The UCI configuration to map. It is automatically loaded
     * along with the resulting map instance.
     * @param title - The title caption of the form. A form title is usually
     * rendered as a separate headline element before the actual form contents.
     * If omitted, the corresponding headline element will not be rendered.
     * @param description - The description text of the form which is usually
     * rendered as a text paragraph below the form title and before the actual
     * form contents. If omitted, the corresponding paragraph element will not
     * be rendered.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Map.html
     */
    constructor(config: string, title?: string, description?: string);

    /**
     * Tie another UCI configuration to the map.
     *
     * By default, a map instance will only load the UCI configuration file
     * specified in the constructor, but sometimes access to values from further
     * configuration files is required. This function allows for such use cases
     * by registering further UCI configuration files which are needed by the map.
     *
     * @param config - The additional UCI configuration file to tie to the map.
     * If the given config is in the list of required files already, it will be
     * ignored.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Map.html#chain
     */
    chain(config: string): void;

    /**
     * Add a configuration section to the map.
     *
     * LuCI forms follow the structure of the underlying UCI configurations.
     * This means that a map, which represents a single UCI configuration, is
     * divided into multiple sections which in turn contain an arbitrary number
     * of options.
     *
     * While UCI itself only knows two kinds of sections - named and anonymous
     * ones - the form class offers various flavors of form section elements to
     * present configuration sections in different ways. Refer to the
     * documentation of the different section classes for details.
     *
     * @typeParam T - The type of AbstractSection subclass being instantiated.
     * @param cbiClass - The section class to use for rendering the configuration
     * section. Note that this value must be the class itself, not a class
     * instance obtained from calling `new`. It must also be a class derived
     * from `AbstractSection`.
     * @param args - Additional arguments which are passed as-is to the
     * constructor of the given section class. Refer to the class specific
     * constructor documentation for details.
     * @returns Returns the instantiated section class instance.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Map.html#section
     */
    section<T extends AbstractSection>(
      cbiClass: ClassConstructor<T>,
      ...args: string[]
    ): T;

    /**
     * Load the configuration covered by this map.
     *
     * The `load()` function first loads all referenced UCI configurations,
     * then it recursively walks the form element tree and invokes the load
     * function of each child element.
     *
     * @returns Returns a promise resolving once the entire form completed
     * loading all data. The promise may reject with an error if any
     * configuration failed to load or if any of the child elements' load
     * functions reject with an error.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Map.html#load
     */
    load(): Promise<void>;

    /**
     * Parse the form input values.
     *
     * The `parse()` function recursively walks the form element tree and
     * triggers input value reading and validation for each child element.
     * Elements which are hidden due to unsatisfied dependencies are skipped.
     *
     * @returns Returns a promise resolving once the entire form completed
     * parsing all input values. The returned promise is rejected if any
     * parsed values do not meet the validation constraints of their
     * respective elements.
     * @override
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Map.html#parse
     */
    parse(): Promise<void>;

    /**
     * Save the form input values.
     *
     * This function parses the current form, saves the resulting UCI changes,
     * reloads the UCI configuration data and redraws the form elements.
     *
     * @param cb - An optional callback function that is invoked after the form
     * is parsed but before the changed UCI data is saved. This is useful to
     * perform additional data manipulation steps before saving the changes.
     * @param silent - If set to `true`, trigger an alert message to the user
     * in case saving the form data fails. Otherwise fail silently.
     * @returns Returns a promise resolving once the entire save operation is
     * complete. The returned promise is rejected if any step of the save
     * operation failed.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Map.html#save
     */
    save(cb?: () => void, silent?: boolean): Promise<void>;

    /**
     * Reset the form by re-rendering its contents.
     *
     * This will revert all unsaved user inputs to their initial form state.
     *
     * @returns Returns a promise resolving to the top-level form DOM node
     * once the re-rendering is complete.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Map.html#reset
     */
    reset(): Promise<Node>;

    /**
     * Render the form markup.
     *
     * @returns Returns a promise resolving to the top-level form DOM node
     * once the rendering is complete.
     * @override
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Map.html#render
     */
    render(): Promise<Node>;

    /**
     * Return all DOM nodes within this Map which match the given search
     * parameters.
     *
     * This function is essentially a convenience wrapper around
     * `querySelectorAll()`.
     *
     * This function is sensitive to the amount of arguments passed to it;
     * if only one argument is specified, it is used as selector-expression
     * as-is. When two arguments are passed, the first argument is treated as
     * an attribute name, the second one as an attribute value to match.
     *
     * As an example, `map.findElements('input')` would find all `<input>`
     * nodes while `map.findElements('type', 'text')` would find any DOM node
     * with a `type="text"` attribute.
     *
     * @param args - Argument array.
     * @param selector_or_attrname - If invoked with only one parameter, this
     * argument is a `querySelectorAll()` compatible selector expression.
     * If invoked with two parameters, this argument is the attribute name to
     * filter for.
     * @param attrvalue - In case the function is invoked with two parameters,
     * this argument specifies the attribute value to match.
     * @returns Returns a (possibly empty) DOM `NodeList` containing the found
     * DOM nodes.
     * @throws {InternalError} Throws an `InternalError` if more than two
     * function parameters are passed.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Map.html#findElements
     */
    findElements(
      ...args: [selector_or_attrname: string] | [selector_or_attrname: string, attrvalue: string]
    ): NodeList;

    /**
     * Return the first DOM node within this Map which matches the given search
     * parameters.
     *
     * This function is essentially a convenience wrapper around `findElements()`
     * which only returns the first found node.
     *
     * This function is sensitive to the amount of arguments passed to it;
     * if only one argument is specified, it is used as selector-expression
     * as-is. When two arguments are passed, the first argument is treated as
     * an attribute name, the second one as an attribute value to match.
     *
     * As an example, `map.findElement('input')` would find the first `<input>`
     * node while `map.findElement('type', 'text')` would find the first DOM
     * node with a `type="text"` attribute.
     *
     * @param args - Argument array.
     * @param selector_or_attrname - If invoked with only one parameter, this
     * argument is a `querySelector()` compatible selector expression.
     * If invoked with two parameters, this argument is the attribute name to
     * filter for.
     * @param attrvalue - In case the function is invoked with two parameters,
     * this argument specifies the attribute value to match.
     * @returns Returns the first found DOM node or `null` if no element matched.
     * @throws {InternalError} Throws an `InternalError` if more than two
     * function parameters are passed.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Map.html#findElement
     */
    findElement(
      ...args: [selector_or_attrname: string] | [selector_or_attrname: string, attrvalue: string]
    ): Node | null;

    /**
     * Find a form option element instance.
     *
     * @param name - The name or the full ID of the option element to look up.
     * @param section_id - The ID of the UCI section that contains the option
     * to look up. May be omitted if a full ID is passed as the first argument.
     * @param config_name - The name of the UCI configuration the option
     * instance belongs to. Defaults to the main UCI configuration of the map
     * if omitted.
     * @returns Returns a two-element array containing the form option instance
     * as the first item and the corresponding UCI section ID as the second
     * item. Returns `null` if the option could not be found.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.Map.html#lookupOption
     */
    lookupOption(
      name: string,
      section_id?: string,
      config_name?: string
    ): [AbstractValue, string] | null;
  }

  /**
   * A `JSONMap` class functions similar to `LuCI.form.Map` but uses a
   * multidimensional JavaScript object instead of UCI configuration as a
   * data source.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.JSONMap.html
   */
  class JSONMap extends Map {
    /**
     * Create a new JSONMap instance.
     *
     * @param data - The JavaScript object to use as a data source. Internally,
     * the object is converted into an UCI-like format. Its top-level keys are
     * treated like UCI section types while the object or array-of-object values
     * are treated as section contents.
     * @param title - The title caption of the form. A form title is usually
     * rendered as a separate headline element before the actual form contents.
     * If omitted, the corresponding headline element will not be rendered.
     * @param description - The description text of the form which is usually
     * rendered as a text paragraph below the form title and before the actual
     * form contents. If omitted, the corresponding paragraph element will not
     * be rendered.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.JSONMap.html
     */
    constructor(
      data: { [sectionType: string]: { [optionName: string]: unknown } | Array<{ [optionName: string]: unknown }> },
      title?: string,
      description?: string
    );
  }

  // ============================================================================
  // Section Classes
  // ============================================================================

  /**
   * The `NamedSection` class maps exactly one UCI section instance which is
   * specified when constructing the class instance. Layout and functionality
   * wise, a named section is essentially a `TypedSection` which allows exactly
   * one section node.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.NamedSection.html
   */
  class NamedSection extends AbstractSection {
    /**
     * Set to `true`, the user may remove or recreate the sole mapped
     * configuration instance from the form section widget, otherwise only a
     * pre-existing section may be edited.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.NamedSection.html#addremove
     */
    addremove: boolean;

    /**
     * If set to `true`, the title caption of the form section element which
     * is normally rendered before the start of the section content will not
     * be rendered in the UI.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.NamedSection.html#hidetitle
     */
    hidetitle: boolean;

    /**
     * Override the UCI configuration name to read the section IDs from.
     * By default, the configuration name is inherited from the parent `Map`.
     * By setting this property, a deviating configuration may be specified.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.NamedSection.html#uciconfig
     */
    uciconfig: string;

    /**
     * The `NamedSection` class overrides the generic `cfgsections()`
     * implementation to return a one-element array containing the mapped
     * section ID as a sole element. User code should not normally change this.
     *
     * @returns Returns a one-element array containing the mapped section ID.
     * @override
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.NamedSection.html#cfgsections
     */
    cfgsections(): string[];

    /**
     * Render the form element.
     *
     * The `render()` function recursively walks the form element tree and
     * renders the markup for each element, returning the assembled DOM tree.
     *
     * @returns May return a DOM Node or a promise resolving to a DOM node
     * containing the form element's markup, including the markup of any
     * child elements.
     * @override
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.NamedSection.html#render
     */
    render(): Node | Promise<Node>;
  }

  /**
   * The `TypedSection` class maps all or - if `filter()` is overridden - a
   * subset of the underlying UCI configuration sections of a given type.
   * Layout wise, the configuration section instances mapped by the section
   * element (sometimes referred to as "section nodes") are stacked beneath
   * each other in a single column, with an optional section remove button
   * next to each section node and a section add button at the end, depending
   * on the value of the `addremove` property.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TypedSection.html
   */
  class TypedSection extends AbstractSection {
    /**
     * If set to `true`, the user may add or remove instances from the form
     * section widget, otherwise only pre-existing sections may be edited.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TypedSection.html#addremove
     */
    addremove: boolean;

    /**
     * If set to `true`, the title caption of the form section element which
     * is normally rendered before the start of the section content will not
     * be rendered in the UI.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TypedSection.html#hidetitle
     */
    hidetitle: boolean;

    /**
     * If set to `true`, mapped section instances are treated as anonymous UCI
     * sections, which means that section instance elements will be rendered
     * without a title element and that no name is required when adding new
     * sections.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TypedSection.html#anonymous
     */
    anonymous: boolean;

    /**
     * When set to `true`, instead of rendering section instances one below
     * another, treat each instance as a separate tab pane and render a tab
     * menu at the top of the form section element, allowing the user to
     * switch among instances.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TypedSection.html#tabbed
     */
    tabbed: boolean;

    /**
     * Override the caption used for the section add button at the bottom of
     * the section form element. Set to a string, it will be used as-is.
     * Set to a function, the function will be invoked and its return value
     * is used as a caption, after converting it to a string.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TypedSection.html#addbtntitle
     */
    addbtntitle: string | (() => string);

    /**
     * Override the caption used for the section delete button at the bottom
     * of the section form element. Set to a string, it will be used as-is.
     * Set to a function, the function will be invoked and its return value
     * is used as a caption, after converting it to a string.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TypedSection.html#delbtntitle
     */
    delbtntitle: string | (() => string);

    /**
     * Override the UCI configuration name to read the section IDs from.
     * By default, the configuration name is inherited from the parent `Map`.
     * By setting this property, a deviating configuration may be specified.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TypedSection.html#uciconfig
     */
    uciconfig: string;

    /**
     * Enumerate the UCI section IDs covered by this form section element.
     *
     * @returns Returns an array of UCI section IDs covered by this form
     * element. The sections will be rendered in the same order as the
     * returned array.
     * @throws {InternalError} Throws an `InternalError` exception if the
     * function is not implemented.
     * @override
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TypedSection.html#cfgsections
     */
    cfgsections(): string[];

    /**
     * Render the form element.
     *
     * The `render()` function recursively walks the form element tree and
     * renders the markup for each element, returning the assembled DOM tree.
     *
     * @returns May return a DOM Node or a promise resolving to a DOM node
     * containing the form element's markup, including the markup of any
     * child elements.
     * @override
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TypedSection.html#render
     */
    render(): Node | Promise<Node>;
  }

  /**
   * The `TableSection` class maps all or - if `filter()` is overridden - a
   * subset of the underlying UCI configuration sections of a given type.
   * Layout wise, the configuration section instances mapped by the section
   * element (sometimes referred to as "section nodes") are rendered as rows
   * within an HTML table element, with an optional section remove button in
   * the last column and a section add button below the table, depending on
   * the value of the `addremove` property.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TableSection.html
   */
  class TableSection extends TypedSection {
    /**
     * Override the per-section instance title caption shown in the first
     * column of the table unless `anonymous` is set to true. Set to a string,
     * it will be used as a `String.format()` pattern with the name of the
     * underlying UCI section as the first argument. Set to a function, the
     * function will be invoked with the section name as the first argument
     * and its return value used as a caption, after converting it to a string.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TableSection.html#sectiontitle
     */
    sectiontitle: string | ((section_id: string) => string);

    /**
     * Set a custom text for the actions column header row when actions
     * buttons are present.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TableSection.html#actionstitle
     */
    actionstitle: string | (() => string);

    /**
     * Specify a maximum amount of columns to display. By default, one table
     * column is rendered for each child option of the form section element.
     * When this option is set to a positive number, then no more columns than
     * the given amount are rendered. When the number of child options exceeds
     * the specified amount, a `More…` button is rendered in the last column,
     * opening a modal dialog presenting all options elements in `NamedSection`
     * style when clicked.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TableSection.html#max_cols
     */
    max_cols: number;

    /**
     * Override the per-section instance modal popup title caption shown when
     * clicking the `More…` button in a section specifying `max_cols`. Set to
     * a string, it will be used as a `String.format()` pattern with the name
     * of the underlying UCI section as the first argument. Set to a function,
     * the function will be invoked with the section name as the first argument,
     * and its return value is used as a caption after converting it to a string.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TableSection.html#modaltitle
     */
    modaltitle: string | ((section_id: string) => string);

    /**
     * Set to `true`, alternating `cbi-rowstyle-1` and `cbi-rowstyle-2` CSS
     * classes are added to the table row elements. Not all LuCI themes
     * implement these row style classes.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TableSection.html#rowcolors
     */
    rowcolors: boolean;

    /**
     * Set to `true`, a clone button is added to the button column, allowing
     * the user to clone section instances mapped by the section form element.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TableSection.html#cloneable
     */
    cloneable: boolean;

    /**
     * Override the caption used for the section clone button at the bottom
     * of the section form element. Set to a string, it will be used as-is.
     * Set to a function, the function will be invoked and its return value
     * is used as a caption, after converting it to a string.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TableSection.html#clonebtntitle
     */
    clonebtntitle: string | (() => string);

    /**
     * Enables a per-section instance row `Edit` button which triggers a
     * certain action when clicked. Set to a string, the string value is used
     * as a `String.format()` pattern with the name of the underlying UCI
     * section as the first format argument. The result is then interpreted as
     * a URL which LuCI will navigate to when the user clicks the edit button.
     * If set to a function, this function will be registered as a click event
     * handler on the rendered edit button, receiving the section instance name
     * as the first and the DOM click event as the second argument.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TableSection.html#extedit
     */
    extedit: string | ((section_id: string, ev: Event) => void);

    /**
     * Optional table filtering for table sections. Set `filterrow` to `true`
     * to display a filter header row in the generated table with per-column
     * text fields to search for string matches in the column. The filter row
     * appears after the titles row. The filters work cumulatively: text in
     * each field shall match an entry for the row to be displayed. The results
     * are filtered live. Matching is case-sensitive, and partial.
     *
     * @default null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TableSection.html#filterrow
     */
    filterrow: boolean;

    /**
     * Optional footer row for table sections. Set `footer` to one of:
     * - a function that returns a table row (`tr`) or node `E('...')`
     * - an array of string cell contents (first entry maps to the name
     *   column if present).
     * This is useful for providing sum totals, extra function buttons or
     * extra space.
     *
     * @default E([])
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TableSection.html#footer
     */
    footer: string[] | (() => Node);

    /**
     * Set to `true`, a sort button is added to the last column, allowing the
     * user to reorder the section instances mapped by the section form element.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TableSection.html#sortable
     */
    sortable: boolean;

    /**
     * Set to `true`, the header row with the descriptions of options will not
     * be displayed. By default, the row of descriptions is automatically
     * displayed when at least one option has a description.
     *
     * @default false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TableSection.html#nodescriptions
     */
    nodescriptions: boolean;

    /**
     * Add further options to the per-section instanced modal popup.
     *
     * This function may be overridden by user code to perform additional setup
     * steps before displaying the more options modal which is useful to e.g.
     * query additional data or to inject further option elements. The default
     * implementation of this function does nothing.
     *
     * @param modalSection - The `NamedSection` instance about to be rendered
     * in the modal popup.
     * @param section_id - The ID of the underlying UCI section the modal
     * popup belongs to.
     * @param ev - The DOM event emitted by clicking the `More…` button.
     * @returns Return values of this function are ignored but if a promise is
     * returned, it is run to completion before the rendering is continued,
     * allowing custom logic to perform asynchronous work before the modal
     * dialog is shown.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TableSection.html#addModalOptions
     */
    addModalOptions(
      modalSection: NamedSection,
      section_id: string,
      ev: Event
    ): unknown | Promise<unknown>;

    /**
     * The `TableSection` implementation does not support option tabbing, so
     * its implementation of `tab()` will always throw an exception when invoked.
     *
     * @param name - The name of the tab to register.
     * @param title - The human readable caption of the tab.
     * @param description - An additional description text for the corresponding
     * tab pane.
     * @throws {string} Throws an exception when invoked.
     * @override
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.TableSection.html#tab
     */
    tab(name: string, title: string, description?: string): void;
  }

  /**
   * The `GridSection` class maps all or - if `filter()` is overridden - a
   * subset of the underlying UCI configuration sections of a given type.
   * A grid section functions similar to a `TableSection` but supports tabbing
   * in the modal overlay. Option elements added with `option()` are shown in
   * the table while elements added with `taboption()` are displayed in the
   * modal popup. Another important difference is that the table cells show a
   * readonly text preview of the corresponding option elements by default,
   * unless the child option element is explicitly made writeable by setting
   * the `editable` property to `true`. Additionally, the grid section honours
   * a `modalonly` property of child option elements.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.GridSection.html
   */
  class GridSection extends TableSection {
    /**
     * Add an option tab to the section.
     *
     * The modal option elements of a grid section may be divided into multiple
     * tabs to provide a better overview to the user. Before options can be
     * moved into a tab pane, the corresponding tab has to be defined first,
     * which is done by calling this function.
     *
     * Note that tabs are only effective in modal popups. Options added with
     * `option()` will not be assigned to a specific tab and are rendered in
     * the table view only.
     *
     * @param name - The name of the tab to register. It may be freely chosen
     * and just serves as an identifier to differentiate tabs.
     * @param title - The human readable caption of the tab.
     * @param description - An additional description text for the corresponding
     * tab pane. It is displayed as a text paragraph below the tab but before
     * the tab pane contents. If omitted, no description will be rendered.
     * @throws {Error} Throws an exception if a tab with the same `name`
     * already exists.
     * @override
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.GridSection.html#tab
     */
    tab(name: string, title: string, description?: string): void;

    /**
     * Parse this section's form input.
     *
     * The `parse()` function recursively walks the section element tree and
     * triggers input value reading and validation for each encountered child
     * option element. Options which are hidden due to unsatisfied dependencies
     * are skipped.
     *
     * @returns Returns a promise resolving once the values of all child
     * elements have been parsed. The returned promise is rejected if any
     * parsed values do not meet the validation constraints of their
     * respective elements.
     * @override
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.GridSection.html#parse
     */
    parse(): Promise<void>;
  }

  /**
   * The `SectionValue` widget embeds a form section element within an option
   * element container, allowing to nest form sections into other sections.
   *
   * @see https://openwrt.github.io/luci/jsapi/LuCI.form.SectionValue.html
   */
  class SectionValue extends AbstractValue {
    /**
     * Access the embedded section instance. This property holds a reference
     * to the instantiated nested section.
     *
     * @readonly
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.SectionValue.html#subsection
     */
    readonly subsection: AbstractSection;

    /**
     * Load the underlying configuration value.
     *
     * The default implementation of this method reads and returns the
     * underlying UCI option value (or the related JavaScript property for
     * `JSONMap` instances). It may be overridden by user code to load data
     * from non-standard sources.
     *
     * @param section_id - The configuration section ID.
     * @returns Returns the configuration value to initialize the option
     * element with. The return value of this function is filtered through
     * `Promise.resolve()` so it may return promises if overridden by user code.
     * @throws {TypeError} Throws a `TypeError` exception when no `section_id`
     * was specified.
     * @override
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.SectionValue.html#load
     */
    load(section_id: string): unknown | Promise<unknown>;

    /**
     * Parse the option element input.
     *
     * The function is invoked when the `parse()` method has been invoked on
     * the parent form and triggers input value reading and validation.
     *
     * @param section_id - The configuration section ID.
     * @returns Returns a promise resolving once the input value has been read
     * and validated or rejecting in case the input value does not meet the
     * validation constraints.
     * @override
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.SectionValue.html#parse
     */
    parse(section_id: string): Promise<void>;

    /**
     * Since the section container is not rendering an own widget, its
     * `value()` implementation is a no-op.
     *
     * @param key - The choice value to add.
     * @param val - The caption for the choice value. May be a DOM node,
     * a document fragment or a plain text string. If omitted, the `key`
     * value is used as a caption.
     * @override
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.SectionValue.html#value
     */
    value(key: string, val?: Node | string): void;

    /**
     * Since the section container is not tied to any UCI configuration, its
     * `write()` implementation is a no-op.
     *
     * @param section_id - The configuration section ID.
     * @param formvalue - The input value to write.
     * @override
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.SectionValue.html#write
     */
    write(section_id: string, formvalue?: string | string[]): null;

    /**
     * Since the section container is not tied to any UCI configuration, its
     * `remove()` implementation is a no-op.
     *
     * @param section_id - The configuration section ID.
     * @override
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.SectionValue.html#remove
     */
    remove(section_id: string): void;

    /**
     * Since the section container is not tied to any UCI configuration, its
     * `cfgvalue()` implementation will always return `null`.
     *
     * @param section_id - The configuration section ID.
     * @param set_value - The value to assign.
     * @returns Always returns `null`.
     * @throws {TypeError} Throws a `TypeError` exception when no `section_id`
     * was specified.
     * @override
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.SectionValue.html#cfgvalue
     */
    cfgvalue(section_id: string, set_value?: string): null;

    /**
     * Since the section container is not tied to any UCI configuration, its
     * `formvalue()` implementation will always return `null`.
     *
     * @param section_id - The configuration section ID.
     * @returns Always returns `null`.
     * @throws {TypeError} Throws a `TypeError` exception when no `section_id`
     * was specified.
     * @override
     * @see https://openwrt.github.io/luci/jsapi/LuCI.form.SectionValue.html#formvalue
     */
    formvalue(section_id: string): null;
  }
}
