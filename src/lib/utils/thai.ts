/**
 * Thai script detection utility.
 *
 * Thai Unicode block: U+0E00–U+0E7F
 * This covers all Thai consonants, vowels, tone marks, and digits.
 */

/** Regex matching any character in the Thai Unicode block. */
const THAI_CHAR_REGEX = /[\u0E00-\u0E7F]/;

/**
 * Returns true if the given string contains at least one Thai character.
 * Used to conditionally apply the .thai CSS class for larger font rendering.
 */
export function isThai(text: string): boolean {
	return THAI_CHAR_REGEX.test(text);
}
