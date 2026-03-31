/**
 * Thai Language Curriculum Data
 *
 * This file defines the complete lesson sequence for learning to read Thai script.
 * The curriculum follows a "real-word-first" approach: each lesson is anchored around
 * a practical Thai word that a traveler would encounter (place names, signs, food terms),
 * and uses that word to introduce new letters and reading rules organically.
 *
 * Lesson stages progress as follows:
 *   Stage 1 - First contact: high-frequency consonants and above-line vowels (หัวหิน)
 *   Stage 2 - Expanding basics: hidden vowels, final consonant stops, long vowels (ตลาด)
 *   Stage 3 - Aspiration contrast: aspirated vs unaspirated consonants (ถนน)
 *   Stage 4 - Silent carriers & final consonant shifts: อ as placeholder, ร as final "n" (อาหาร)
 *
 * Each lesson builds on previously learned letters and rules, with explicit review
 * of earlier characters via the `reviewLetters` array.
 */
import type { Lesson, LanguagePack } from './types';

const lessons: Lesson[] = [
	// ---------------------------------------------------------------
	// Stage 1: First Thai word -- introduces core consonants (ห, ว, น)
	// and above-line short vowels (ั, ิ)
	// ---------------------------------------------------------------
	{
		id: 1,
		stage: 1,
		title: 'Hua Hin — Your First Thai Word',
		anchorWord: {
			thai: 'หัวหิน',
			meaning: 'Hua Hin (beach town)',
			pronunciation: 'hǔa-hǐn',
			category: 'place',
			syllables: [
				{ thai: 'หัว', sound: 'hǔa' },
				{ thai: 'หิน', sound: 'hǐn' }
			],
			contextNote: 'A famous beach resort town south of Bangkok. You\'ll see this on bus signs, train schedules, and road signs everywhere.'
		},
		newLetters: [
			{
				character: 'ห',
				romanization: 'h',
				pronunciation: 'h as in "hello"',
				type: 'consonant',
				class: 'high',
				mnemonic: 'Looks like a jar — "H" for a jar of Honey',
				position: 'standalone'
			},
			{
				character: 'ั',
				romanization: 'a',
				pronunciation: 'short "a" as in "cut"',
				type: 'vowel',
				mnemonic: 'A little hat sitting on top — short and quick like the sound',
				position: 'above'
			},
			{
				character: 'ว',
				romanization: 'w',
				pronunciation: 'w as in "water"',
				type: 'consonant',
				class: 'low',
				mnemonic: 'Looks like a curling wave — "W" for Wave',
				position: 'standalone'
			},
			{
				character: 'ิ',
				romanization: 'i',
				pronunciation: 'short "i" as in "sit"',
				type: 'vowel',
				mnemonic: 'A tiny spike above — quick and short like the sound',
				position: 'above'
			},
			{
				character: 'น',
				romanization: 'n',
				pronunciation: 'n as in "no"',
				type: 'consonant',
				class: 'low',
				mnemonic: 'A smooth loop — "N" for a Nice knot',
				position: 'standalone'
			}
		],
		rulesIntroduced: [
			{
				id: 'leading-h',
				name: 'Leading H',
				shortDescription: 'ห starts many Thai words as the "h" sound',
				explanation: 'The letter ห (h) is one of the most common starting consonants in Thai. When you see it at the beginning of a word, just pronounce it as "h".',
				examples: ['หัว (hǔa) — head', 'หิน (hǐn) — stone']
			},
			{
				id: 'short-vowels-above',
				name: 'Vowels Sit Above',
				shortDescription: 'Some Thai vowels are written above the consonant',
				explanation: 'Unlike English where vowels sit on the line, Thai short vowels like ิ (i) and ั (a) are written above the consonant they follow in pronunciation. You read the consonant first, then the vowel on top.',
				examples: ['หิ = h + i = hi', 'หั = h + a = ha']
			}
		],
		drills: [
			{
				type: 'recognize',
				prompt: 'Which letter makes the "h" sound?',
				options: ['ห', 'น', 'ว', 'ต'],
				correctIndex: 0
			},
			{
				type: 'recognize',
				prompt: 'Which letter makes the "n" sound?',
				options: ['ว', 'ห', 'น', 'ด'],
				correctIndex: 2
			},
			{
				type: 'recognize',
				prompt: 'Which letter makes the "w" sound?',
				options: ['น', 'ว', 'ห', 'ล'],
				correctIndex: 1
			},
			{
				type: 'match',
				prompt: 'What does หัวหิน mean?',
				options: ['Market', 'Hua Hin (beach town)', 'Road', 'Food'],
				correctIndex: 1
			},
			{
				type: 'spot',
				prompt: 'Which word is หัวหิน (Hua Hin)?',
				options: ['หัวหิน', 'หินหัว', 'นิวหา', 'วันหา'],
				correctIndex: 0
			},
			{
				type: 'sound',
				prompt: 'How do you pronounce หิน?',
				options: ['wan', 'hin', 'hun', 'han'],
				correctIndex: 1
			}
		]
	},
	// ---------------------------------------------------------------
	// Stage 2: Market vocabulary -- introduces mid-class consonants
	// (ต, ด), the low-class consonant ล, and the long vowel า.
	// Key rules: hidden short "a" vowel, final consonant stopping.
	// ---------------------------------------------------------------
	{
		id: 2,
		stage: 2,
		title: 'The Market — ตลาด',
		anchorWord: {
			thai: 'ตลาด',
			meaning: 'market',
			pronunciation: 'tà-làat',
			category: 'place',
			syllables: [
				{ thai: 'ตล', sound: 'tà-l' },
				{ thai: 'า', sound: 'aa' },
				{ thai: 'ด', sound: 't' }
			],
			contextNote: 'Markets are everywhere in Thailand. You\'ll see ตลาด on signs for night markets, floating markets, and neighborhood markets.'
		},
		newLetters: [
			{
				character: 'ต',
				romanization: 't',
				pronunciation: 't as in "stop" (unaspirated)',
				type: 'consonant',
				class: 'mid',
				mnemonic: 'A little turtle shape — "T" for Turtle',
				position: 'standalone'
			},
			{
				character: 'ล',
				romanization: 'l',
				pronunciation: 'l as in "love"',
				type: 'consonant',
				class: 'low',
				mnemonic: 'A looping line — "L" for Loop',
				position: 'standalone'
			},
			{
				character: 'า',
				romanization: 'aa',
				pronunciation: 'long "aa" as in "father"',
				type: 'vowel',
				mnemonic: 'A tall line standing next to its consonant — long and tall like the long sound',
				position: 'right'
			},
			{
				character: 'ด',
				romanization: 'd',
				pronunciation: 'd as in "dog" (initial), t as in "cat" (final)',
				type: 'consonant',
				class: 'mid',
				mnemonic: 'Looks like a little dome — "D" for Dome',
				position: 'standalone'
			}
		],
		rulesIntroduced: [
			{
				id: 'hidden-vowel',
				name: 'Hidden Short "a" Vowel',
				shortDescription: 'When two consonants can\'t blend, a short "a" hides between them',
				explanation: 'In Thai, when two consonants appear next to each other but can\'t form a natural cluster, a short "a" sound is inserted between them. In ตลาด, the ต and ล can\'t blend, so you say "tà-làat" not "tlàat". This hidden vowel is never written!',
				examples: ['ตล → tà-l (hidden "a" between ต and ล)', 'ถนน → thà-nǒn (hidden "a" between ถ and น)']
			},
			{
				id: 'final-consonant-stop',
				name: 'Final Consonants are Stopped',
				shortDescription: 'Consonants at the end of a syllable are "swallowed"',
				explanation: 'When ด appears at the end of a word, it doesn\'t make a full "d" sound. Instead, your tongue touches the roof of your mouth but you don\'t release it — it becomes a stopped "t" sound. This is why ตลาด sounds like "tà-làat" not "tà-làad".',
				examples: ['ตลาด → tà-làat (final ด sounds like "t")', 'หมด → mòt (final ด sounds like "t")']
			}
		],
		drills: [
			{
				type: 'recognize',
				prompt: 'Which letter makes the "t" sound (unaspirated)?',
				options: ['ด', 'ต', 'ถ', 'น'],
				correctIndex: 1
			},
			{
				type: 'recognize',
				prompt: 'Which letter makes the "l" sound?',
				options: ['น', 'ว', 'ล', 'ห'],
				correctIndex: 2
			},
			{
				type: 'sound',
				prompt: 'Why is there an "a" between ต and ล in ตลาด?',
				options: [
					'It\'s written but invisible',
					'They can\'t blend, so a short "a" is inserted',
					'It\'s a tone marker',
					'ล always has an "a" before it'
				],
				correctIndex: 1
			},
			{
				type: 'match',
				prompt: 'What does ตลาด mean?',
				options: ['road', 'market', 'food', 'stone'],
				correctIndex: 1
			},
			{
				type: 'spot',
				prompt: 'Which word is ตลาด (market)?',
				options: ['ตลาด', 'ดาลต', 'ลาดต', 'ตาลด'],
				correctIndex: 0
			},
			{
				type: 'recognize',
				prompt: 'Which vowel makes the long "aa" sound?',
				options: ['ิ', 'ั', 'า', 'ว'],
				correctIndex: 2
			}
		],
		reviewLetters: ['ห', 'น', 'ว']
	},
	// ---------------------------------------------------------------
	// Stage 3: Street signs -- introduces the aspirated consonant ถ.
	// Key rules: aspirated vs unaspirated "t" distinction, hidden
	// vowel pattern reinforcement with a new consonant pair.
	// ---------------------------------------------------------------
	{
		id: 3,
		stage: 3,
		title: 'The Road — ถนน',
		anchorWord: {
			thai: 'ถนน',
			meaning: 'road / street',
			pronunciation: 'thà-nǒn',
			category: 'sign',
			syllables: [
				{ thai: 'ถน', sound: 'thà-n' },
				{ thai: 'น', sound: 'on' }
			],
			contextNote: 'You\'ll see ถนน on every street sign in Thailand, usually followed by the street name. "ถนนสุขุมวิท" (Thanon Sukhumvit) is one of Bangkok\'s most famous roads.'
		},
		newLetters: [
			{
				character: 'ถ',
				romanization: 'th',
				pronunciation: 'th as in "Thailand" (aspirated t)',
				type: 'consonant',
				class: 'high',
				mnemonic: 'Like ต but with an extra curl — the extra air (aspiration) curls out',
				position: 'standalone'
			}
		],
		rulesIntroduced: [
			{
				id: 'hidden-vowel-cluster',
				name: 'Hidden Vowel in Consonant Clusters',
				shortDescription: 'ถน can\'t blend — a hidden "a" appears between them',
				explanation: 'Just like ตล in ตลาด, the letters ถ and น can\'t form a natural cluster. So a hidden short "a" is inserted: ถนน becomes "thà-nǒn". You\'re already familiar with this pattern!',
				examples: ['ถนน → thà-nǒn', 'ตลาด → tà-làat']
			},
			{
				id: 'aspirated-vs-unaspirated',
				name: 'Aspirated vs Unaspirated T',
				shortDescription: 'ต (t) and ถ (th) sound different — one has a puff of air',
				explanation: 'Hold your hand in front of your mouth. Say "top" — you\'ll feel a puff of air. That\'s aspirated, like ถ (th). Now say "stop" — no puff. That\'s unaspirated, like ต (t). Thai distinguishes these as completely different letters!',
				examples: ['ต = t (no puff, like "stop")', 'ถ = th (puff of air, like "top")']
			}
		],
		drills: [
			{
				type: 'recognize',
				prompt: 'Which letter makes the aspirated "th" sound?',
				options: ['ต', 'ถ', 'ด', 'น'],
				correctIndex: 1
			},
			{
				type: 'sound',
				prompt: 'How do you pronounce ถนน?',
				options: ['tnon', 'thà-nǒn', 'thanon', 'thun'],
				correctIndex: 1
			},
			{
				type: 'match',
				prompt: 'What does ถนน mean?',
				options: ['market', 'hotel', 'road', 'food'],
				correctIndex: 2
			},
			{
				type: 'spot',
				prompt: 'Which is the aspirated "t" (th)?',
				options: ['ต', 'ด', 'ถ', 'น'],
				correctIndex: 2
			},
			{
				type: 'spot',
				prompt: 'Spot ถนน (road) among these words:',
				options: ['ตลาด', 'ถนน', 'หัวหิน', 'นนถ'],
				correctIndex: 1
			},
			{
				type: 'sound',
				prompt: 'What\'s the difference between ต and ถ?',
				options: [
					'ต is high class, ถ is low class',
					'ต has no puff of air, ถ has a puff of air',
					'They sound the same',
					'ต is only used at the end of words'
				],
				correctIndex: 1
			}
		],
		reviewLetters: ['ต', 'ล', 'า', 'ด', 'ห', 'น']
	},
	// ---------------------------------------------------------------
	// Stage 4: Food vocabulary -- introduces the silent carrier อ
	// and ร (which shifts to "n" in final position).
	// Key rules: อ as a vowel placeholder, final ร-to-n reduction.
	// ---------------------------------------------------------------
	{
		id: 4,
		stage: 4,
		title: 'Food — อาหาร',
		anchorWord: {
			thai: 'อาหาร',
			meaning: 'food',
			pronunciation: 'aa-hǎan',
			category: 'food',
			syllables: [
				{ thai: 'อา', sound: 'aa' },
				{ thai: 'หา', sound: 'hǎa' },
				{ thai: 'ร', sound: 'n' }
			],
			contextNote: 'อาหาร means "food" and appears on restaurant signs, food courts, and menus across Thailand. ร้านอาหาร means "restaurant" (literally "food shop").'
		},
		newLetters: [
			{
				character: 'อ',
				romanization: '(silent/glottal)',
				pronunciation: 'Silent carrier — gives vowels a place to sit',
				type: 'consonant',
				class: 'mid',
				mnemonic: 'An empty circle — "O" for "Oh, it\'s silent!"',
				position: 'standalone'
			},
			{
				character: 'ร',
				romanization: 'r',
				pronunciation: 'r as in "run" (initial), n as in "man" (final)',
				type: 'consonant',
				class: 'low',
				mnemonic: 'A graceful curve — "R" for a River bend',
				position: 'standalone'
			}
		],
		rulesIntroduced: [
			{
				id: 'silent-carrier',
				name: 'อ as a Silent Carrier',
				shortDescription: 'อ gives vowels a "home" when there\'s no initial consonant sound',
				explanation: 'In Thai, every syllable must start with a consonant. But what if the syllable starts with a vowel sound? The letter อ acts as a silent placeholder — it carries the vowel without adding any sound of its own. In อาหาร, the อ carries the า vowel, giving us "aa".',
				examples: ['อา = aa (อ is silent, just carries า)', 'อิ = i (อ carries ิ)']
			},
			{
				id: 'final-r-to-n',
				name: 'Final ร Sounds Like "n"',
				shortDescription: 'When ร appears at the end of a word, it\'s pronounced as "n"',
				explanation: 'This surprises many learners! In Thai, the letter ร (r) at the end of a syllable or word is pronounced as "n", not "r". So อาหาร is "aa-hǎan", not "aa-hǎar". This is called final consonant reduction.',
				examples: ['อาหาร → aa-hǎan (final ร = n)', 'สาร → sǎan (final ร = n)']
			}
		],
		drills: [
			{
				type: 'recognize',
				prompt: 'Which letter is the silent carrier?',
				options: ['ห', 'อ', 'น', 'ร'],
				correctIndex: 1
			},
			{
				type: 'sound',
				prompt: 'How is ร pronounced at the END of a word?',
				options: ['r as in "run"', 'l as in "love"', 'n as in "man"', 'It\'s silent'],
				correctIndex: 2
			},
			{
				type: 'match',
				prompt: 'What does อาหาร mean?',
				options: ['road', 'market', 'stone', 'food'],
				correctIndex: 3
			},
			{
				type: 'sound',
				prompt: 'How do you pronounce อาหาร?',
				options: ['aa-haar', 'aa-hǎan', 'or-ha-r', 'ah-han'],
				correctIndex: 1
			},
			{
				type: 'spot',
				prompt: 'Which word means "food"?',
				options: ['ถนน', 'ตลาด', 'อาหาร', 'หัวหิน'],
				correctIndex: 2
			},
			{
				type: 'recognize',
				prompt: 'Why does อาหาร start with อ?',
				options: [
					'Because อ makes the "o" sound',
					'Because the syllable needs a consonant and อ is a silent carrier',
					'Because อ is always first',
					'It\'s optional'
				],
				correctIndex: 1
			}
		],
		reviewLetters: ['ห', 'า', 'ถ', 'น', 'ต', 'ล', 'ด']
	}
];

/** The complete Thai language pack exported for use by the app */
export const thaiPack: LanguagePack = {
	id: 'thai',
	name: 'Thai',
	nativeName: 'ภาษาไทย',
	direction: 'ltr',
	lessons
};
