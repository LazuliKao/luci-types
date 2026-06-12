/**
 * LuCI Password strength checking tool
 *
 * Provides methods for checking password quality criteria:
 * length, digits, mixed case, and special characters.
 *
 * @see https://github.com/openwrt/luci/blob/master/modules/luci-base/htdocs/luci-static/resources/tools/password.js
 */
declare namespace LuCI.tools.password {
  interface PasswordChecker {
    /**
     * Check whether the password meets the minimum length requirement.
     *
     * @param p - The password string to check.
     * @param required - The minimum required length (as string from config).
     * @returns `true` when the password length meets the requirement or no requirement is given; `false` when the requirement is set but not met.
     */
    checkLength(p: string, required: string): boolean;

    /**
     * Check whether the password contains at least one digit.
     *
     * @param p - The password string to check.
     * @returns `true` if at least one digit is present, `false` otherwise.
     */
    checkDigits(p: string): boolean;

    /**
     * Check whether the password contains both uppercase and lowercase letters.
     *
     * @param p - The password string to check.
     * @returns `true` if both uppercase and lowercase letters are present, `false` otherwise.
     */
    checkUpperLower(p: string): boolean;

    /**
     * Check whether the password contains at least one special (non-alphanumeric) character.
     *
     * @param p - The password string to check.
     * @returns `true` if at least one special character is present, `false` otherwise.
     */
    checkSpecialChars(p: string): boolean;
  }

  interface PasswordCheckerConstructor {
    new (): PasswordChecker;
    extend(properties: Record<string, unknown>): PasswordCheckerConstructor;
  }
}
