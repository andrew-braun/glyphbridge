/**
 * Thai script utilities.
 *
 * Thai Unicode block: U+0E00–U+0E7F
 * This covers all Thai consonants, vowels, tone marks, and digits.
 */

/** Regex matching any character in the Thai Unicode block. */
const THAI_CHAR_REGEX = /[\u0E00-\u0E7F]/;

/**
 * Thai combining characters — vowels and tone marks that are written
 * above, below, or around a base consonant. When displayed in isolation
 * (e.g. in a letter chip or tile) they have no base to attach to, which
 * causes them to render as floating diacritics that look broken.
 *
 * Unicode ranges covered:
 *   U+0E31        ั  sara a (above)
 *   U+0E34–0E37   ิ ี ึ ื  sara i/ii/ue/uee (above)
 *   U+0E38–0E39   ุ ู  sara u/uu (below)
 *   U+0E47        ็  maitaikhu (above)
 *   U+0E48–0E4E   ้ ้ ๊ ๋ ์ ํ ๎  tone marks and special marks (above)
 */
const THAI_COMBINING_REGEX = /^[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]$/;

/**
 * The dotted circle (U+25CC) is the Unicode standard placeholder base
 * character for displaying combining diacritics in isolation. Thai
 * dictionaries, linguistics texts, and script-learning materials all
 * use ◌ + vowel to show vowel shapes without implying a specific consonant.
 */
const DOTTED_CIRCLE = '\u25CC';

/**
 * Returns true if the given string contains at least one Thai character.
 * Used to conditionally apply the .thai CSS class for larger font rendering.
 */
export function isThai(text: string): boolean {
	return THAI_CHAR_REGEX.test(text);
}

/**
 * Prepares a single Thai letter character for standalone display
 * (e.g. in a letter chip, alphabet tile, or lesson completion grid).
 *
 * Combining vowels and tone marks have no base consonant in these contexts,
 * so they render as floating diacritics. This function prefixes them with a
 * dotted circle (◌) so the combining mark has something to attach to —
 * the standard typographic convention in Thai educational materials.
 *
 * Standalone consonants are returned unchanged.
 *
 * @example
 *   displayLetter('ห') // → 'ห'   (consonant, unchanged)
 *   displayLetter('ั') // → '◌ั'  (combining vowel, gets dotted circle base)
 *   displayLetter('ิ') // → '◌ิ'  (combining vowel, gets dotted circle base)
 */
export function displayLetter(character: string): string {
	if (THAI_COMBINING_REGEX.test(character)) {
		return DOTTED_CIRCLE + character;
	}
	return character;
}
