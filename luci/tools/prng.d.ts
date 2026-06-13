/**
 * LuCI PRNG (Pseudo Random Number Generator) tool
 *
 * Provides a deterministic PRNG based on 64-bit arithmetic with methods
 * for generating random integers, floats in [0,1), and deriving colors
 * from string inputs.
 *
 * @see https://github.com/openwrt/luci/blob/master/modules/luci-base/htdocs/luci-static/resources/tools/prng.js
 */
declare namespace LuCI.tools.prng {
	interface PRNG {
		/**
		 * Seed the PRNG state.
		 *
		 * The seed is treated as a 32-bit integer; the lower 16 bits are stored
		 * in the first word, the upper 16 bits in the second word.
		 *
		 * @param n - Seed value (32-bit integer)
		 */
		seed(n: number): void;

		/**
		 * Produce the next PRNG 32-bit integer.
		 *
		 * Advances the internal state and returns a 32-bit pseudo-random integer
		 * derived from the current state.
		 *
		 * @returns 32-bit pseudo-random integer
		 */
		int(): number;

		/**
		 * Return a pseudo-random value.
		 *
		 * Overloads:
		 * - `get()` → float in [0, 1)
		 * - `get(upper)` → integer in [1, upper]
		 * - `get(lower, upper)` → integer in [lower, upper]
		 *
		 * @param lower - Lower bound when two args supplied (default 0)
		 * @param upper - Upper bound when one or two args supplied (default 0)
		 * @returns Random value (float in [0,1) or integer in requested range)
		 */
		get(): number;
		get(upper: number): number;
		get(lower: number, upper: number): number;

		/**
		 * Derive a deterministic hex color from an input string.
		 *
		 * The color is produced by seeding the PRNG from a string-derived
		 * hash and producing RGB components.
		 *
		 * @param string - Input string used to derive the color
		 * @returns Hex color string in `#rrggbb` format
		 */
		derive_color(string: string): string;
	}

	interface PRNGConstructor {
		new (): PRNG;
		extend(properties: Record<string, unknown>): PRNGConstructor;
	}
}
