declare namespace LuCI.baseclass {
  /**
   * Extends this base class with the properties described in properties and returns a new subclassed Class instance.
   * This function serves as the primary means to create subclasses of given classes and implements prototypal inheritance.
   *
   * @param properties An object describing the properties to add to the new subclass.
   * @returns A new LuCI.baseclass subclassed from this class, extended by the given properties and with its prototype set to this base class to enable inheritance. The resulting value represents a class constructor and can be instantiated with new.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.baseclass.html#extend
   */
  function extend(properties: Record<string, any>): typeof LuCI.baseclass;

  /**
   * Calls the class constructor using new with the given argument array being passed as variadic parameters to the constructor.
   *
   * @param args An array of arbitrary values which will be passed as arguments to the constructor function.
   * @returns A new LuCI.baseclass instance extended by the given properties with its prototype set to this base class to enable inheritance.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.baseclass.html#instantiate
   */
  function instantiate(args: any[]): LuCI.baseclass;

  /**
   * Checks whether the given class value is a subclass of this class.
   *
   * @param classValue The class object to test.
   * @returns true when the given classValue is a subclass of this class or false if the given value is not a valid class or not a subclass of this class.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.baseclass.html#isSubclass
   */
  function isSubclass(classValue: any): boolean;

  /**
   * Extends this base class with the properties described in properties, instantiates the resulting subclass using the given arguments passed to this function and returns the resulting subclassed Class instance.
   * This function serves as a convenience shortcut for extend() and subsequent new.
   *
   * @param properties An object describing the properties to add to the new subclass.
   * @param new_args Arguments forwarded to the constructor of the generated subclass.
   * @returns A new LuCI.baseclass instance extended by the given properties with its prototype set to this base class to enable inheritance.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.baseclass.html#singleton
   */
  function singleton(properties: Record<string, any>, ...new_args: any[]): LuCI.baseclass;

  interface IBaseclass {
    /**
     * Walks up the parent class chain and looks for a class member called key in any of the parent classes this class inherits from.
     * Returns the member value of the superclass or calls the member as a function and returns its return value when the optional callArgs array is given.
     *
     * This method has two signatures:
     * - super('key') - Returns the value of key when found within one of the parent classes.
     * - super('key', ['arg1', 'arg2']) - Calls the key() method with parameters arg1 and arg2 when found within one of the parent classes.
     *
     * @param key The name of the superclass member to retrieve.
     * @param callArgs Arguments to pass when invoking the superclass method. May be either an argument array or variadic arguments.
     * @returns The value of the found member or the return value of the call to the found method. Returns null when no member was found in the parent class chain or when the call to the superclass method returned null.
     * @throws ReferenceError when callArgs are specified and the found member named by key is not a function value.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.baseclass.html#super
     */
    super(key: string, callArgs?: any[] | any): any | null;

    /**
     * Returns a string representation of this class.
     *
     * @returns A string representation of this class containing the constructor functions displayName and describing the class members and their respective types.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.baseclass.html#toString
     */
    toString(): string;

    /**
     * Extract all values from the given argument array beginning from offset and prepend any further given optional parameters to the beginning of the resulting array copy.
     *
     * @param args The array to extract the values from.
     * @param offset The offset from which to extract the values. An offset of 0 would copy all values till the end.
     * @param extra_args Extra arguments to add and prepend to the resulting array.
     * @returns A new array consisting of the optional extra arguments and the values extracted from the args array beginning with offset.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.baseclass.html#varargs
     */
    varargs(args: any[], offset: number, ...extra_args: any[]): any[];
  }
}
