declare namespace LuCI.validation {
  /**
   * Compare two arrays element-wise: return true if `a < b` in lexicographic element comparison.
   * @param a - First array of numbers.
   * @param b - Second array of numbers.
   * @returns True if arrays compare as `a < b`, false otherwise.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.validation.html
   */
  function arrayle(a: number[], b: number[]): boolean;

  /**
   * Return byte length of a string using Blob (UTF-8 byte count).
   * @param x - Input string.
   * @returns Byte length of the string.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.validation.html
   */
  function bytelen(x: string): number;

  /**
   * Validator class for field validation operations.
   * @class
   */
  class Validator {
    /**
     * Create a new Validator instance.
     * @param field - The UI field to validate.
     * @param type - Type of validator.
     * @param optional - Set the validation result as optional.
     * @param vfunc - Validation function.
     * @param validatorFactory - A ValidatorFactory instance.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.validation.Validator.html
     */
    constructor(
      field: string,
      type: string,
      optional: boolean,
      vfunc: (value: unknown) => boolean,
      validatorFactory: ValidatorFactory
    );

    /**
     * Apply a validation function by name or directly via function reference.
     * If a name is provided it resolves it via the factory's registered `types`.
     * @param name - Validator name or function.
     * @param value - Value to validate (optional; defaults to field value).
     * @param args - Arguments passed to the validator function.
     * @returns Validator result.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.validation.Validator.html
     */
    apply(name: string | Function, value?: unknown, args?: unknown[]): unknown;

    /**
     * Assert a condition and update field error state.
     * @param condition - Condition that must be true.
     * @param message - Error message when assertion fails.
     * @returns True when assertion is true, false otherwise.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.validation.Validator.html
     */
    assert(condition: boolean, message: string): boolean;

    /**
     * Validate the associated field value using the compiled validator stack and
     * any additional validators provided at construction time.
     * Emits 'validation-failure' or 'validation-success' CustomEvents on the field.
     * @returns True if validation succeeds, false otherwise.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.validation.Validator.html
     */
    validate(): boolean;
  }

  /**
   * Factory to create Validator instances and compile validation expressions.
   * @class
   */
  class ValidatorFactory {
    /**
     * Create a new ValidatorFactory instance.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.validation.ValidatorFactory.html
     */
    constructor();

    /**
     * Compile a validator expression string into an internal stack representation.
     * @param code - Validator expression string (e.g., `or(ipaddr,port)`).
     * @returns Compiled token stack used by validators.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.validation.ValidatorFactory.html
     */
    compile(code: string): unknown[];

    /**
     * Create a Validator instance for a field with a specified type and validation function.
     * @param field - Field name.
     * @param type - Validator type.
     * @param optional - Whether the field is optional.
     * @param vfunc - A validator function or expression.
     * @returns A Validator instance.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.validation.ValidatorFactory.html
     */
    create(
      field: string,
      type: string,
      optional: boolean,
      vfunc: (value: unknown) => boolean | string
    ): Validator;

    /**
     * Parse a decimal number string. Returns NaN when not a valid number.
     * @param x - Input string.
     * @returns Decimal number or NaN.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.validation.ValidatorFactory.html
     */
    parseDecimal(x: string): number;

    /**
     * Parse an integer string. Returns NaN when not a valid integer.
     * @param x - Input string.
     * @returns Integer or NaN.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.validation.ValidatorFactory.html
     */
    parseInteger(x: string): number;

    /**
     * Parse IPv4 address into an array of 4 octets or return null on failure.
     * @param x - IPv4 address string.
     * @returns Array of 4 octets or null.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.validation.ValidatorFactory.html
     */
    parseIPv4(x: string): number[] | null;

    /**
     * Parse IPv6 address into an array of 8 16-bit words or return null on failure.
     * Supports IPv4-embedded IPv6 (::ffff:a.b.c.d) and zero-compression.
     * @param x - IPv6 address string.
     * @returns Array of 8 16-bit words or null.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.validation.ValidatorFactory.html
     */
    parseIPv6(x: string): number[] | null;
  }
}
