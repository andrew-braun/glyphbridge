/**
 * Thai Language Curriculum Data
 *
 * This sequence rewrites the original curriculum around the frequency-first,
 * real-world reading strategy captured in docs/concept/approach-thai.md.
 * The order now starts with high-payoff words and grapheme chunks that unlock
 * menus, storefronts, simple adjectives, and everyday survival vocabulary.
 *
 * Stage groups progress as follows:
 *   Stage 1 - Core payoff words and the first high-frequency vowels
 *   Stage 2 - Market and movement words with reusable syllable frames
 *   Stage 3 - Before-vowels and tone marks taught through sight words
 *   Stage 4 - Sibilants, short vowels, and price/menu language
 *   Stage 5 - High-class survival words, silent carriers, and food lexicon
 */
import type { LanguagePack, Lesson, LessonVocabularyEntry, Word } from "./types";

type BaseLesson = Omit<Lesson, "vocabulary">;

function createWord(
	thai: string,
	meaning: string,
	pronunciation: string,
	category: Word["category"],
	syllables: Word["syllables"],
	contextNote?: string,
): Word {
	return {
		thai,
		meaning,
		pronunciation,
		category,
		syllables,
		contextNote,
	};
}

function createPracticeEntry(
	word: Word,
	options: {
		tier?: LessonVocabularyEntry["tier"];
		sourceType?: LessonVocabularyEntry["sourceType"];
		drillTarget?: boolean;
	} = {},
): LessonVocabularyEntry {
	return {
		tier: options.tier ?? "core",
		sourceType: options.sourceType ?? "real",
		drillTarget: options.drillTarget ?? true,
		word,
	};
}

const baseLessons: BaseLesson[] = [
	{
		id: 1,
		stage: 1,
		title: "มาก — Your First High-Payoff Word",
		anchorWord: {
			thai: "มาก",
			meaning: "very / a lot",
			pronunciation: "mâak",
			category: "daily",
			syllables: [
				{ thai: "มา", sound: "maa" },
				{ thai: "ก", sound: "k" },
			],
			contextNote:
				"You'll hear and read มาก everywhere: ดีมาก (very good), เผ็ดมาก (very spicy), and discount copy that promises a lot.",
		},
		newLetters: [
			{
				character: "ม",
				romanization: "m",
				pronunciation: 'm as in "mother"',
				type: "consonant",
				class: "low",
				mnemonic:
					"ม is ม ม้า (mor ma, horse). Picture the tall middle stroke as a horse's neck and the small loop as its head, then tie that horse word to the m sound.",
				position: "standalone",
			},
			{
				character: "า",
				romanization: "aa",
				pronunciation: 'long "aa" as in "father"',
				type: "vowel",
				mnemonic:
					"า is the right-side long aa stroke. It stands after the consonant and stretches the syllable into the long vowel you hear in มา and กา.",
				position: "right",
			},
			{
				character: "ก",
				romanization: "g/k",
				pronunciation: 'hard g/k sound; final ก closes like "k"',
				type: "consonant",
				class: "mid",
				mnemonic:
					"ก is ก ไก่ (gor gai, chicken), the classic Thai alphabet anchor. Picture the hook as the chicken's head and beak for the hard g/k sound.",
				position: "standalone",
			},
		],
		rulesIntroduced: [
			{
				id: "long-aa-right",
				name: "Long า Stretches Right",
				shortDescription: "า is written after the consonant and gives you a long aa sound",
				explanation:
					"Thai often places vowels around a consonant instead of in a straight line like English. The long vowel า sits to the right of the consonant and stretches the syllable into a clear aa sound.",
				examples: ["มาก = mâak", "ตา = taa"],
			},
			{
				id: "final-k-stop",
				name: "Final ก Ends in a Stop",
				shortDescription: "At the end of a syllable, ก closes sharply as a k sound",
				explanation:
					"Thai final consonants are often clipped. In มาก, the last ก does not open into a full English g. It closes the syllable with a short unreleased k sound.",
				examples: ["มาก = mâak"],
			},
			{
				id: "implied-short-o",
				name: 'Two Bare Consonants Often Add a Short "o"',
				shortDescription:
					"When Thai stacks two consonants with no written vowel, a short o often appears between them",
				explanation:
					"Once you know a few consonants, you can read more than long-vowel forms. In many short Thai syllables, two consonants written together with no vowel sign are read with an implied short o sound between them.",
				examples: ["นก = nok", "รถ = rot"],
			},
		],
		drills: [
			{
				type: "recognize",
				prompt: 'Which letter makes the "m" sound?',
				options: ["ก", "ม", "น", "ด"],
				correctIndex: 1,
			},
			{
				type: "recognize",
				prompt: 'Which symbol makes the long "aa" sound?',
				options: ["า", "ิ", "ี", "ั"],
				correctIndex: 0,
			},
			{
				type: "match",
				prompt: "What does มาก mean?",
				options: ["mother", "very / a lot", "shop", "rice"],
				correctIndex: 1,
			},
			{
				type: "spot",
				prompt: 'Which Thai spelling means "very / a lot"?',
				options: ["มาก", "กาม", "มกา", "ดาก"],
				correctIndex: 0,
			},
			{
				type: "sound",
				prompt: "How does the final ก sound in มาก?",
				options: ["m", "k", "g", "n"],
				correctIndex: 1,
			},
			{
				type: "sound",
				prompt: "If two consonants appear together with no written vowel, what sound often shows up between them?",
				options: ['long "aa"', 'long "ee"', 'short "o"', 'long "oo"'],
				correctIndex: 2,
			},
		],
	},
	{
		id: 2,
		stage: 1,
		title: "ดี — A Core Word for Good Things",
		anchorWord: {
			thai: "ดี",
			meaning: "good",
			pronunciation: "dii",
			category: "daily",
			syllables: [{ thai: "ดี", sound: "dii" }],
			contextNote:
				"You'll see ดี inside greetings, reviews, and product copy. It is one of the most reusable positive words in beginner Thai.",
		},
		newLetters: [
			{
				character: "ด",
				romanization: "d/t",
				pronunciation: 'd as in "dog" at the start; clipped t at the end',
				type: "consonant",
				class: "mid",
				mnemonic:
					"ด is ด เด็ก (dor dek, child). Picture the loop as a child's round head beside a small body; ด starts words with d and closes as t.",
				position: "standalone",
			},
			{
				character: "ี",
				romanization: "ii",
				pronunciation: 'long "ee" as in "see"',
				type: "vowel",
				mnemonic:
					"ี is ิ with an extra length stroke on top. That extra stroke is your clue to hold the sound longer: short i becomes long ii.",
				position: "above",
			},
		],
		rulesIntroduced: [
			{
				id: "long-ii-above",
				name: "Long ี Sits Above",
				shortDescription: "ี is written above the consonant and gives you a long ee sound",
				explanation:
					"Thai vowels are often placed above, below, or around the consonant. In ดี, the consonant comes first and the long vowel ี sits above it, so you read ด then stretch into ee.",
				examples: ["ดี = dii", "สี = sii"],
			},
			{
				id: "initial-d-sound",
				name: "Initial ด Starts Cleanly",
				shortDescription: "At the start of a syllable, ด gives you a plain d sound",
				explanation:
					"Thai consonants can behave differently at the start and the end of a syllable. In ดี, ด is initial, so you read it as a straightforward d sound before the vowel.",
				examples: ["ดี = dii", "ดา = daa"],
			},
		],
		drills: [
			{
				type: "recognize",
				prompt: 'Which letter starts with the "d" sound?',
				options: ["ก", "ด", "ม", "น"],
				correctIndex: 1,
			},
			{
				type: "recognize",
				prompt: 'Which vowel gives the long "ee" sound?',
				options: ["ี", "า", "ิ", "ั"],
				correctIndex: 0,
			},
			{
				type: "match",
				prompt: "What does ดี mean?",
				options: ["good", "road", "eat", "shop"],
				correctIndex: 0,
			},
			{
				type: "spot",
				prompt: 'Which Thai spelling means "good"?',
				options: ["ดี", "ดิ", "ดา", "มี"],
				correctIndex: 0,
			},
			{
				type: "sound",
				prompt: "In ดี, where is the vowel written?",
				options: [
					"before the consonant",
					"after the consonant",
					"above the consonant",
					"below the consonant",
				],
				correctIndex: 2,
			},
		],
		reviewLetters: ["ม", "า", "ก"],
	},
	{
		id: 3,
		stage: 1,
		title: "กิน — The Everyday Food Verb",
		anchorWord: {
			thai: "กิน",
			meaning: "to eat",
			pronunciation: "gin",
			category: "food",
			syllables: [
				{ thai: "กิ", sound: "gi" },
				{ thai: "น", sound: "n" },
			],
			contextNote:
				"กิน appears everywhere in daily life, from restaurant invitations to questions about what you want to eat.",
		},
		newLetters: [
			{
				character: "น",
				romanization: "n",
				pronunciation: 'n as in "no"',
				type: "consonant",
				class: "low",
				mnemonic:
					"น is น หนู (nor nuu, mouse). Picture the curl as a little mouse body and tail, and use หนู to lock in the n sound.",
				position: "standalone",
			},
			{
				character: "ิ",
				romanization: "i",
				pronunciation: 'short "i" as in "sit"',
				type: "vowel",
				mnemonic:
					"ิ is the short i mark above the consonant. It has no extra length stroke, so keep the vowel quick in words like กิน.",
				position: "above",
			},
		],
		rulesIntroduced: [
			{
				id: "short-i-above",
				name: "Short ิ Sits Above",
				shortDescription: "The short i vowel appears above the consonant you read first",
				explanation:
					"Thai often asks you to scan above the line as you read. In กิน, the consonant ก comes first and the short vowel ิ is written above it, giving you gi before the final consonant closes the syllable.",
				examples: ["กิน = gin", "บิน = bin"],
			},
			{
				id: "final-n-stays-n",
				name: "Final น Stays N",
				shortDescription: "At the end of a syllable, น keeps a clear n sound",
				explanation:
					"Not every Thai final consonant gets clipped into a stop. Final น stays nasal and easy to hear, so กิน closes with a clear n sound.",
				examples: ["กิน = gin", "บิน = bin"],
			},
		],
		drills: [
			{
				type: "recognize",
				prompt: 'Which letter makes the "n" sound?',
				options: ["ก", "น", "ด", "ม"],
				correctIndex: 1,
			},
			{
				type: "recognize",
				prompt: 'Which vowel gives the short "i" sound?',
				options: ["ิ", "ี", "า", "ั"],
				correctIndex: 0,
			},
			{
				type: "match",
				prompt: "What does กิน mean?",
				options: ["to eat", "market", "ten", "fresh"],
				correctIndex: 0,
			},
			{
				type: "spot",
				prompt: 'Which Thai spelling means "to eat"?',
				options: ["กิน", "กีน", "นิก", "มิน"],
				correctIndex: 0,
			},
			{
				type: "sound",
				prompt: "How do you read the end of กิน?",
				options: ["gii", "gin", "git", "gim"],
				correctIndex: 1,
			},
		],
		reviewLetters: ["ก", "ด", "ี", "ม", "า"],
	},
	{
		id: 4,
		stage: 2,
		title: "ตลาด — Read the Market Sign",
		anchorWord: {
			thai: "ตลาด",
			meaning: "market",
			pronunciation: "tà-làat",
			category: "place",
			syllables: [
				{ thai: "ตล", sound: "tà-l" },
				{ thai: "า", sound: "aa" },
				{ thai: "ด", sound: "t" },
			],
			contextNote:
				"Markets are everywhere in Thailand. You'll see ตลาด on signs for night markets, floating markets, and neighborhood markets.",
		},
		newLetters: [
			{
				character: "ต",
				romanization: "t",
				pronunciation: 't as in "stop" (unaspirated)',
				type: "consonant",
				class: "mid",
				mnemonic:
					"ต is ต เต่า (tor tao, turtle). Picture the rounded part as a turtle shell with a small head, then read it as the plain t/dt sound.",
				position: "standalone",
			},
			{
				character: "ล",
				romanization: "l",
				pronunciation: 'l as in "love"',
				type: "consonant",
				class: "low",
				mnemonic:
					"ล is ล ลิง (lor ling, monkey). Let the long lower curve be the monkey's tail, and connect ลิง to the l sound.",
				position: "standalone",
			},
		],
		rulesIntroduced: [
			{
				id: "hidden-vowel-market",
				name: 'Hidden Short "a" Vowel',
				shortDescription:
					'When two consonants can\'t blend, a short "a" hides between them',
				explanation:
					'In Thai, when two consonants appear next to each other but can\'t form a natural cluster, a short "a" sound is inserted between them. In ตลาด, the ต and ล can\'t blend, so you say "tà-làat" not "tlàat". This hidden vowel is never written.',
				examples: [
					'ตล = tà-l (hidden "a" between ต and ล)',
					'ถนน = thà-nǒn (hidden "a" between ถ and น)',
				],
			},
			{
				id: "final-stop-market",
				name: "Final Consonants are Stopped",
				shortDescription: 'Consonants at the end of a syllable are "swallowed"',
				explanation:
					'When ด appears at the end of a word, it doesn\'t make a full "d" sound. Instead, your tongue touches the roof of your mouth but you don\'t release it. This is why ตลาด sounds like "tà-làat" and not "tà-làad".',
				examples: ["ตลาด = tà-làat", "หมด = mòt"],
			},
		],
		drills: [
			{
				type: "recognize",
				prompt: 'Which letter makes the plain "t" sound?',
				options: ["ถ", "ต", "ด", "ล"],
				correctIndex: 1,
			},
			{
				type: "recognize",
				prompt: 'Which letter makes the "l" sound?',
				options: ["ม", "น", "ล", "ก"],
				correctIndex: 2,
			},
			{
				type: "match",
				prompt: "What does ตลาด mean?",
				options: ["road", "market", "mother", "airport"],
				correctIndex: 1,
			},
			{
				type: "sound",
				prompt: 'Why is there an "a" between ต and ล in ตลาด?',
				options: [
					"Because it is written but invisible",
					'Because Thai inserts a short "a" when the consonants do not blend naturally',
					"Because the tone mark creates it",
					"Because ล always starts with a vowel",
				],
				correctIndex: 1,
			},
			{
				type: "spot",
				prompt: 'Which Thai spelling means "market"?',
				options: ["ตลาด", "ตาลด", "ลาดต", "ดาลต"],
				correctIndex: 0,
			},
		],
		reviewLetters: ["ก", "ม", "า", "ด", "น", "ิ", "ี"],
	},
	{
		id: 5,
		stage: 2,
		title: "บิน — Reuse the -ิน Pattern",
		anchorWord: {
			thai: "บิน",
			meaning: "to fly",
			pronunciation: "bin",
			category: "transport",
			syllables: [
				{ thai: "บิ", sound: "bi" },
				{ thai: "น", sound: "n" },
			],
			contextNote:
				"บิน appears in airport language, travel offers, and casual talk about planes and trips. It also helps you see how reusable the -ิน frame is.",
		},
		newLetters: [
			{
				character: "บ",
				romanization: "b/p",
				pronunciation: 'b as in "bat" at the start; clipped p at the end',
				type: "consonant",
				class: "mid",
				mnemonic:
					"บ is บ ใบไม้ (bor bai mai, leaf). The open bowl shape can hold a leaf, and ใบไม้ gives you the b sound at the start.",
				position: "standalone",
			},
		],
		rulesIntroduced: [
			{
				id: "initial-b-sound",
				name: "Initial บ Starts With B",
				shortDescription: "At the start of a syllable, บ gives you a plain b sound",
				explanation:
					"Thai consonants often shift between initial and final positions. In บิน, บ comes first, so it sounds like a clean b before the short vowel and final consonant close the word.",
				examples: ["บิน = bin", "บา = baa"],
			},
			{
				id: "in-frame-pattern",
				name: "The -ิน Frame Repeats",
				shortDescription:
					"Once you know a syllable frame, swapping the first consonant unlocks more words",
				explanation:
					"กิน, บิน, and similar short words share the same short-i plus final-น frame. Thai gets much easier once you start seeing these reusable patterns instead of single isolated words.",
				examples: ["กิน = gin", "บิน = bin", "ดิน = din"],
			},
		],
		drills: [
			{
				type: "recognize",
				prompt: 'Which letter makes the "b" sound at the start?',
				options: ["บ", "ด", "ม", "น"],
				correctIndex: 0,
			},
			{
				type: "match",
				prompt: "What does บิน mean?",
				options: ["to fly", "to eat", "market", "rice"],
				correctIndex: 0,
			},
			{
				type: "spot",
				prompt: 'Which Thai spelling means "to fly"?',
				options: ["บิน", "นบิ", "บีน", "ดิน"],
				correctIndex: 0,
			},
			{
				type: "sound",
				prompt: "Which word keeps the same -ิน pattern as บิน?",
				options: ["กิน", "มาก", "แม่", "ร้าน"],
				correctIndex: 0,
			},
			{
				type: "sound",
				prompt: "How do you pronounce บิน?",
				options: ["bin", "baan", "boon", "bii"],
				correctIndex: 0,
			},
		],
		reviewLetters: ["ก", "น", "ิ", "ด", "ต", "ล", "า"],
	},
	{
		id: 6,
		stage: 3,
		title: "แม่ — Before Vowels and First Tone Marks",
		anchorWord: {
			thai: "แม่",
			meaning: "mother",
			pronunciation: "mâae",
			category: "daily",
			syllables: [
				{ thai: "แม", sound: "mae" },
				{ thai: "่", sound: "tone change" },
			],
			contextNote:
				"You'll see แม่ in family words, shop names, and cultural phrases. It also gives you your first look at a vowel written before the consonant.",
		},
		newLetters: [
			{
				character: "แ",
				romanization: "ae",
				pronunciation: 'long "ae" as in the vowel of "care"',
				type: "vowel",
				mnemonic:
					"แ is a double left-side vowel. The two front posts tell your eye to look left first, then come back to the consonant for ae.",
				position: "left",
			},
			{
				character: "่",
				romanization: "mai ek",
				pronunciation: "first tone mark written above the consonant",
				type: "tone_mark",
				mnemonic:
					"่ is mai ek, the first tone mark. It is one small stroke above the consonant, so read it as a compact tone cue.",
				position: "above",
			},
		],
		rulesIntroduced: [
			{
				id: "before-vowels-left",
				name: "Some Vowels Sit on the Left",
				shortDescription: "The vowel แ is written before the consonant you pronounce first",
				explanation:
					"Thai does not always place vowels after the consonant. In แม่, your eye has to notice แ on the left, then come back to read ม with that vowel sound attached.",
				examples: ["แม = mae", "แต่ = dtàae"],
			},
			{
				id: "mai-ek-tone-mark",
				name: "Meet Your First Tone Mark",
				shortDescription:
					"Tone marks sit above the consonant and change the sound of the whole syllable",
				explanation:
					"You do not need the full tone system at once. Start by recognizing that ่ lives above the consonant and changes the word you say. High-frequency sight words make tone marks easier to remember than abstract charts.",
				examples: ["แม่ = mâae", "แต่ = dtàae"],
			},
		],
		drills: [
			{
				type: "recognize",
				prompt: "Which vowel is written before the consonant?",
				options: ["แ", "า", "ิ", "ี"],
				correctIndex: 0,
			},
			{
				type: "recognize",
				prompt: "Which mark is mai ek?",
				options: ["่", "้", "แ", "ั"],
				correctIndex: 0,
			},
			{
				type: "match",
				prompt: "What does แม่ mean?",
				options: ["mother", "shop", "road", "fresh"],
				correctIndex: 0,
			},
			{
				type: "spot",
				prompt: 'Which Thai spelling means "mother"?',
				options: ["แม่", "แม", "มา", "แน"],
				correctIndex: 0,
			},
			{
				type: "recognize",
				prompt: "What changes when you add ่ above แม?",
				options: [
					"the vowel disappears",
					"the tone changes",
					"the final consonant changes",
					"the word becomes longer",
				],
				correctIndex: 1,
			},
		],
		reviewLetters: ["ม", "า", "ด", "ี", "ก", "น", "ิ"],
	},
	{
		id: 7,
		stage: 3,
		title: "ร้าน — The Word on Every Storefront",
		anchorWord: {
			thai: "ร้าน",
			meaning: "shop",
			pronunciation: "râan",
			category: "place",
			syllables: [
				{ thai: "ร้า", sound: "raa" },
				{ thai: "น", sound: "n" },
			],
			contextNote:
				"You'll see ร้าน everywhere: ร้านกาแฟ, ร้านอาหาร, ร้านยา. Learning it early pays off on almost every street.",
		},
		newLetters: [
			{
				character: "ร",
				romanization: "r",
				pronunciation: 'r as in "run" at the start; n at the end in some words',
				type: "consonant",
				class: "low",
				mnemonic:
					"ร is ร เรือ (ror ruea, boat). Picture the main curve as a boat hull rocking forward, and use เรือ to remember the r sound.",
				position: "standalone",
			},
			{
				character: "้",
				romanization: "mai tho",
				pronunciation: "second tone mark written above the consonant",
				type: "tone_mark",
				mnemonic:
					"้ is mai tho, the second tone mark. It looks heavier than mai ek, a good cue that this is the second above-letter tone mark.",
				position: "above",
			},
		],
		rulesIntroduced: [
			{
				id: "initial-r-sound",
				name: "Initial ร Gives You R",
				shortDescription: "At the start of a syllable, ร is read as an r sound",
				explanation:
					"Thai ร has a few different jobs, but in ร้าน it is straightforward: it starts the word with an r sound before the tone mark and vowel shape do the rest of the work.",
				examples: ["รา = raa", "ร้าน = râan"],
			},
			{
				id: "mai-tho-above",
				name: "Tone Marks Sit Above the Consonant",
				shortDescription:
					"Even when the vowel is on the right, the tone mark still sits above the main consonant",
				explanation:
					"In ร้าน, the long vowel า is on the right, but the tone mark ้ still sits above ร. Thai asks you to scan the whole syllable block, not just read from left to right.",
				examples: ["ร้า = râa", "ร้าน = râan"],
			},
		],
		drills: [
			{
				type: "recognize",
				prompt: 'Which letter starts with the "r" sound?',
				options: ["ร", "ล", "น", "ม"],
				correctIndex: 0,
			},
			{
				type: "recognize",
				prompt: "Which mark is mai tho?",
				options: ["่", "้", "ี", "แ"],
				correctIndex: 1,
			},
			{
				type: "match",
				prompt: "What does ร้าน mean?",
				options: ["mother", "shop", "ten", "very"],
				correctIndex: 1,
			},
			{
				type: "spot",
				prompt: 'Which Thai spelling means "shop"?',
				options: ["ร้าน", "ร่าน", "ราน", "น้าร"],
				correctIndex: 0,
			},
			{
				type: "sound",
				prompt: "Where is the tone mark written in ร้าน?",
				options: [
					"under the consonant",
					"above the consonant",
					"before the vowel",
					"after the final consonant",
				],
				correctIndex: 1,
			},
		],
		reviewLetters: ["น", "า", "ม", "ด", "ต", "ล", "แ", "่"],
	},
	{
		id: 8,
		stage: 4,
		title: "ชุด — Short U in Menu Combos",
		anchorWord: {
			thai: "ชุด",
			meaning: "set / combo",
			pronunciation: "chút",
			category: "food",
			syllables: [
				{ thai: "ชุ", sound: "chu" },
				{ thai: "ด", sound: "t" },
			],
			contextNote:
				"ชุด shows up in set menus, school uniforms, and clothing signs. On menus, it often means a fixed combo or meal set.",
		},
		newLetters: [
			{
				character: "ช",
				romanization: "ch",
				pronunciation: 'ch as in "check"',
				type: "consonant",
				class: "low",
				mnemonic:
					"ช is ช ช้าง (chor chaang, elephant). Picture the long dropping stroke as an elephant trunk, and use ช้าง for the ch sound.",
				position: "standalone",
			},
			{
				character: "ุ",
				romanization: "u",
				pronunciation: 'short "u" as in "put"',
				type: "vowel",
				mnemonic:
					"ุ is the short u mark tucked under the consonant. Low on the page and short in sound: use it for the quick u in ชุด.",
				position: "below",
			},
		],
		rulesIntroduced: [
			{
				id: "short-u-below",
				name: "Short ุ Sits Below",
				shortDescription:
					"The short u vowel is written below the consonant you pronounce first",
				explanation:
					"Thai keeps asking you to scan vertically. In ชุด, the consonant ช comes first and the short vowel ุ is tucked underneath, so you read chu before the final consonant closes the syllable.",
				examples: ["ชุ = chu", "ชุด = chút"],
			},
			{
				id: "dead-syllable-stop",
				name: "Short Vowels Feel Clipped in Closed Syllables",
				shortDescription:
					"A short vowel plus a final stop makes the whole word feel quick and closed",
				explanation:
					"ชุด feels short because the vowel is short and the final consonant is stopped. This clipped rhythm shows up in lots of practical Thai words on menus and signs.",
				examples: ["ชุด = chút", "มุด = mút"],
			},
		],
		drills: [
			{
				type: "recognize",
				prompt: 'Which letter makes the "ch" sound?',
				options: ["ช", "ส", "บ", "ร"],
				correctIndex: 0,
			},
			{
				type: "recognize",
				prompt: "Which vowel is written below the consonant?",
				options: ["ุ", "ิ", "า", "แ"],
				correctIndex: 0,
			},
			{
				type: "match",
				prompt: "What does ชุด mean on a menu?",
				options: ["set / combo", "fresh", "rice", "to fly"],
				correctIndex: 0,
			},
			{
				type: "spot",
				prompt: 'Which Thai spelling means "set / combo"?',
				options: ["ชุด", "ชาด", "สด", "ชดุ"],
				correctIndex: 0,
			},
			{
				type: "sound",
				prompt: "How does the final ด sound in ชุด?",
				options: ["d", "t", "n", "silent"],
				correctIndex: 1,
			},
		],
		reviewLetters: ["ด", "ต", "น", "ิ", "า", "ร", "้"],
	},
	{
		id: 9,
		stage: 4,
		title: "สิบ — Read Prices Faster",
		anchorWord: {
			thai: "สิบ",
			meaning: "ten",
			pronunciation: "sìp",
			category: "sign",
			syllables: [
				{ thai: "สิ", sound: "si" },
				{ thai: "บ", sound: "p" },
			],
			contextNote:
				"สิบ helps with prices, receipts, and quantity labels. Even one number word gives you real payoff in markets and transit.",
		},
		newLetters: [
			{
				character: "ส",
				romanization: "s",
				pronunciation: 's as in "sun"',
				type: "consonant",
				class: "high",
				mnemonic:
					"ส is ส เสือ (sor suea, tiger). The pointed, striped-looking shape can cue a tiger, and เสือ starts with the crisp s sound.",
				position: "standalone",
			},
		],
		rulesIntroduced: [
			{
				id: "initial-s-sound",
				name: "Initial ส Gives You S",
				shortDescription: "At the start of a syllable, ส is a clean s sound",
				explanation:
					"Thai has several letters that can map to an s-like sound, but you do not need them all at once. Start with ส because it appears constantly in useful words, labels, and polite formulas.",
				examples: ["สิบ = sìp", "สด = sòt"],
			},
			{
				id: "final-b-to-p",
				name: "Final บ Closes as P",
				shortDescription: "At the end of a word, บ does not stay a full b sound",
				explanation:
					"Like several Thai final consonants, บ gets clipped at the end of a syllable. In สิบ, your lips close for p without the full released English b sound.",
				examples: ["สิบ = sìp", "บัส = bát"],
			},
		],
		drills: [
			{
				type: "recognize",
				prompt: 'Which letter makes the "s" sound?',
				options: ["ส", "ช", "ร", "บ"],
				correctIndex: 0,
			},
			{
				type: "match",
				prompt: "What does สิบ mean?",
				options: ["rice", "shop", "ten", "mother"],
				correctIndex: 2,
			},
			{
				type: "sound",
				prompt: "Why does final บ in สิบ sound like p?",
				options: [
					"Thai drops all final consonants",
					"final บ closes as p in Thai",
					"the tone mark changes it",
					"the vowel makes it silent",
				],
				correctIndex: 1,
			},
			{
				type: "spot",
				prompt: 'Which Thai spelling means "ten"?',
				options: ["สิบ", "บิส", "สด", "สบิ"],
				correctIndex: 0,
			},
			{
				type: "sound",
				prompt: "How do you pronounce สิบ?",
				options: ["sib", "sii", "sip", "sup"],
				correctIndex: 2,
			},
		],
		reviewLetters: ["บ", "ิ", "น", "ด", "ช", "ุ"],
	},
	{
		id: 10,
		stage: 5,
		title: "ข้าว — A Survival Food Word",
		anchorWord: {
			thai: "ข้าว",
			meaning: "rice",
			pronunciation: "khâao",
			category: "food",
			syllables: [
				{ thai: "ข้า", sound: "khaa" },
				{ thai: "ว", sound: "w glide" },
			],
			contextNote:
				"ข้าว is one of the highest-value food words in Thailand. It appears on menus, in meal names, and in everyday conversation.",
		},
		newLetters: [
			{
				character: "ข",
				romanization: "kh",
				pronunciation: 'kh with a puff of air, like the start of "khaki"',
				type: "consonant",
				class: "high",
				mnemonic:
					"ข is ข ไข่ (khor khai, egg). Picture the open curve as an eggshell; ไข่ starts with the puffed kh sound that separates ข from ก.",
				position: "standalone",
			},
			{
				character: "ว",
				romanization: "w",
				pronunciation: 'w as in "water"; can help form vowel glides',
				type: "consonant",
				class: "low",
				mnemonic:
					"ว is ว แหวน (wor waen, ring). The rounded curl looks like a ring, and แหวน gives you the w sound.",
				position: "standalone",
			},
		],
		rulesIntroduced: [
			{
				id: "kh-vs-k",
				name: "ข Adds Air to K",
				shortDescription: "ข is not the same as ก; it has a stronger puff of air",
				explanation:
					"Thai distinguishes plain k sounds from aspirated kh sounds. If you hold your hand in front of your mouth, ข pushes out a little air in a way ก does not.",
				examples: ["กา = gaa", "ข่าว = khàao", "ข้าว = khâao"],
			},
			{
				id: "aaw-glide",
				name: "ว Can Help Build a Vowel Glide",
				shortDescription:
					"In words like ข้าว, ว helps shape the ending vowel sound instead of behaving like a full separate consonant",
				explanation:
					"Not every written consonant is heard as a clean standalone consonant. In ข้าว, ว helps form the -าว ending, so you hear a smooth glide rather than a sharp final w.",
				examples: ["ข่าว = khàao", "ข้าว = khâao"],
			},
		],
		drills: [
			{
				type: "recognize",
				prompt: 'Which letter gives the aspirated "kh" sound?',
				options: ["ก", "ข", "บ", "ห"],
				correctIndex: 1,
			},
			{
				type: "recognize",
				prompt: "Which letter helps build the -าว ending in ข้าว?",
				options: ["น", "ว", "ร", "ล"],
				correctIndex: 1,
			},
			{
				type: "match",
				prompt: "What does ข้าว mean?",
				options: ["rice", "fresh", "ten", "mother"],
				correctIndex: 0,
			},
			{
				type: "spot",
				prompt: 'Which Thai spelling means "rice"?',
				options: ["ข้าว", "ขาว", "ข้า", "ขน"],
				correctIndex: 0,
			},
			{
				type: "sound",
				prompt: "What is the key difference between ก and ข?",
				options: [
					"ก is nasal and ข is silent",
					"ข has a puff of air and ก does not",
					"they sound the same",
					"ข is only used at the end of words",
				],
				correctIndex: 1,
			},
		],
		reviewLetters: ["า", "ก", "ม", "ร", "้", "น"],
	},
	{
		id: 11,
		stage: 5,
		title: "หมู — Leading ห in a Real Menu Word",
		anchorWord: {
			thai: "หมู",
			meaning: "pork",
			pronunciation: "mǔu",
			category: "food",
			syllables: [
				{ thai: "ห", sound: "leading h" },
				{ thai: "มู", sound: "muu" },
			],
			contextNote:
				"หมู is everywhere on Thai menus. It is also the cleanest early example of the leading-ห pattern that learners need sooner rather than later.",
		},
		newLetters: [
			{
				character: "ห",
				romanization: "h",
				pronunciation: 'h as in "hello"; often used as a leading tone helper',
				type: "consonant",
				class: "high",
				mnemonic:
					"ห is ห หีบ (hor hiip, chest). Picture the tall shape as a chest with a lid; in words like หมู, this h-letter can also guide the tone.",
				position: "standalone",
			},
			{
				character: "ู",
				romanization: "uu",
				pronunciation: 'long "oo" as in "food"',
				type: "vowel",
				mnemonic:
					"ู is the long uu mark below the consonant. It is like ุ with a longer lower tail, so let the oo sound run longer.",
				position: "below",
			},
		],
		rulesIntroduced: [
			{
				id: "leading-h-pattern",
				name: "Leading ห Changes the Tone Pattern",
				shortDescription:
					"In common words like หมู, ห helps a following low consonant behave differently",
				explanation:
					"This is one of the Thai chunks worth learning as a whole. In words like หมู, the ห is not there to give you a full h sound before every letter. It helps control the syllable pattern of the low consonant that follows.",
				examples: ["หมู = mǔu", "หมอ = mǎaw"],
			},
			{
				id: "long-uu-below",
				name: "Long ู Sits Below",
				shortDescription: "The long oo vowel is written below the consonant",
				explanation:
					"Thai uses the space below the line too. In หมู and หู, the vowel ู sits under the consonant and gives you a long oo sound.",
				examples: ["หมู = mǔu", "ดู = duu"],
			},
		],
		drills: [
			{
				type: "recognize",
				prompt: "Which letter is the leading ห in หมู?",
				options: ["ห", "ม", "ข", "อ"],
				correctIndex: 0,
			},
			{
				type: "recognize",
				prompt: 'Which vowel makes the long "oo" sound?',
				options: ["ุ", "ู", "ิ", "ี"],
				correctIndex: 1,
			},
			{
				type: "match",
				prompt: "What does หมู mean?",
				options: ["pork", "rice", "shop", "food"],
				correctIndex: 0,
			},
			{
				type: "spot",
				prompt: 'Which Thai spelling means "pork"?',
				options: ["หมู", "มู", "หมา", "ขู"],
				correctIndex: 0,
			},
			{
				type: "sound",
				prompt: "Why is ห useful in words like หมู?",
				options: [
					"It adds a final consonant",
					"It changes the tone pattern of the low consonant that follows",
					"It marks plural",
					"It makes the vowel longer all by itself",
				],
				correctIndex: 1,
			},
		],
		reviewLetters: ["ม", "ข", "า", "ว"],
	},
	{
		id: 12,
		stage: 5,
		title: "อาหาร — Silent Carrier, Useful Sign",
		anchorWord: {
			thai: "อาหาร",
			meaning: "food",
			pronunciation: "aa-hǎan",
			category: "food",
			syllables: [
				{ thai: "อา", sound: "aa" },
				{ thai: "หา", sound: "hǎa" },
				{ thai: "ร", sound: "n" },
			],
			contextNote:
				"อาหาร appears on restaurant signs, food courts, and delivery labels. Once you can read ร้านอาหาร, the street starts feeling more legible.",
		},
		newLetters: [
			{
				character: "อ",
				romanization: "silent carrier",
				pronunciation:
					"placeholder consonant used when a syllable begins with a vowel sound",
				type: "consonant",
				class: "mid",
				mnemonic:
					"อ is อ อ่าง (or aang, basin). The round basin shape can hold a vowel, which fits its job as a silent carrier in อา and อาหาร.",
				position: "standalone",
			},
		],
		rulesIntroduced: [
			{
				id: "silent-carrier",
				name: "อ Can Carry a Vowel Silently",
				shortDescription:
					"Thai still wants a consonant slot even when the syllable begins with a vowel sound",
				explanation:
					"In อาหาร, the first syllable sounds like aa, but Thai still writes a consonant letter to hold that opening vowel. อ acts as the carrier without adding a strong sound of its own.",
				examples: ["อา = aa", "อาหาร = aa-hǎan"],
			},
			{
				id: "final-r-to-n",
				name: 'Final ร Often Sounds Like "n"',
				shortDescription:
					'At the end of a syllable, ร is often heard as "n" instead of a full r',
				explanation:
					"Thai final consonants do not always match their initial sounds. In อาหาร, the final ร is not read as a strong r. It closes the word with an n-like ending instead.",
				examples: ["อาหาร = aa-hǎan", "สาร = sǎan"],
			},
		],
		drills: [
			{
				type: "recognize",
				prompt: "Which letter is the silent carrier?",
				options: ["อ", "ห", "ร", "ว"],
				correctIndex: 0,
			},
			{
				type: "match",
				prompt: "What does อาหาร mean?",
				options: ["food", "set menu", "mother", "to fly"],
				correctIndex: 0,
			},
			{
				type: "spot",
				prompt: 'Which Thai spelling means "food"?',
				options: ["อาหาร", "หารอา", "หมู", "ผัด"],
				correctIndex: 0,
			},
			{
				type: "sound",
				prompt: "How does the final ร sound in อาหาร?",
				options: ["r", "l", "n", "silent"],
				correctIndex: 2,
			},
			{
				type: "recognize",
				prompt: "Why does อาหาร begin with อ?",
				options: [
					"It marks plural",
					"Thai needs a consonant slot, so อ carries the opening vowel",
					"It is only decorative",
					"It always means the word is formal",
				],
				correctIndex: 1,
			},
		],
		reviewLetters: ["ห", "ร", "า", "ด", "น"],
	},
	{
		id: 13,
		stage: 5,
		title: "ผัด — Unlock Stir-Fry Words",
		anchorWord: {
			thai: "ผัด",
			meaning: "stir-fry",
			pronunciation: "phàt",
			category: "food",
			syllables: [
				{ thai: "ผั", sound: "pha" },
				{ thai: "ด", sound: "t" },
			],
			contextNote:
				"ผัด appears on some of the most common Thai dishes, from ผัดไทย to vegetable stir-fries. It is one of the highest-value cooking words you can learn.",
		},
		newLetters: [
			{
				character: "ผ",
				romanization: "ph",
				pronunciation:
					'ph with a puff of air, like the start of "photo" without the f sound',
				type: "consonant",
				class: "high",
				mnemonic:
					"ผ is ผ ผึ้ง (phor phueng, bee). Picture the open shape as wings and body; ผึ้ง starts with the puffed ph sound.",
				position: "standalone",
			},
			{
				character: "ั",
				romanization: "a",
				pronunciation: 'short "a" as in "cut"',
				type: "vowel",
				mnemonic:
					"ั is the short a cap above the consonant. It sits close and quick, just like the clipped a in ผัด and ผัก.",
				position: "above",
			},
		],
		rulesIntroduced: [
			{
				id: "ph-vs-b",
				name: "ผ Gives You an Airy Ph Sound",
				shortDescription: "ผ is not the same as บ; it starts with a stronger puff of air",
				explanation:
					"Thai distinguishes plain b/p-like sounds from aspirated ph sounds. In ผัด, you can feel a burst of air at the start that you do not get with บ.",
				examples: ["ผัด = phàt", "ผัน = phan"],
			},
			{
				id: "short-a-above",
				name: "Short ั Sits Above",
				shortDescription: "The short a vowel is written above the consonant",
				explanation:
					"Thai uses a small mark above the consonant for the short a sound in words like ผัด. It is quicker and more clipped than the long right-side vowel า you learned earlier.",
				examples: ["ผัด = phàt", "ผัน = phan"],
			},
		],
		drills: [
			{
				type: "recognize",
				prompt: 'Which letter makes the aspirated "ph" sound?',
				options: ["ผ", "บ", "ห", "ข"],
				correctIndex: 0,
			},
			{
				type: "recognize",
				prompt: 'Which vowel gives the short "a" sound above the consonant?',
				options: ["ั", "า", "แ", "ุ"],
				correctIndex: 0,
			},
			{
				type: "match",
				prompt: "What does ผัด mean?",
				options: ["stir-fry", "food court", "shop", "ten"],
				correctIndex: 0,
			},
			{
				type: "spot",
				prompt: 'Which Thai spelling means "stir-fry"?',
				options: ["ผัด", "ผาด", "ผาก", "ชุด"],
				correctIndex: 0,
			},
			{
				type: "sound",
				prompt: "Which word shares the same ผั- opening as ผัด?",
				options: ["ผัก", "ข้าว", "บิน", "แม่"],
				correctIndex: 0,
			},
		],
		reviewLetters: ["ด", "ต", "ข", "ห", "อ", "ม", "า"],
	},
];

// Practice vocabulary stays ordered and lesson-scoped so the app can present
// core transfer reads first, then optional extension work when it exists.
const practiceVocabularyByLessonId: Record<number, LessonVocabularyEntry[]> = {
	1: [
		createPracticeEntry(
			createWord(
				"มา",
				"to come",
				"maa",
				"daily",
				[{ thai: "มา", sound: "maa" }],
				"A basic movement verb you will hear in invitations, directions, and casual conversation.",
			),
		),
		createPracticeEntry(
			createWord(
				"กา",
				"crow / kettle / mark",
				"gaa",
				"daily",
				[{ thai: "กา", sound: "gaa" }],
				"A compact real word that reuses the same long-aa frame with no extra letters added.",
			),
		),
		createPracticeEntry(
			createWord(
				"กาก",
				"dregs / residue",
				"gaak",
				"daily",
				[{ thai: "กาก", sound: "gaak" }],
				"A real dictionary word that gives early final-k practice without adding extra glyphs.",
			),
		),
		createPracticeEntry(
			createWord(
				"มาม",
				"sound-only practice",
				"maam",
				"daily",
				[{ thai: "มาม", sound: "maam" }],
				"A clearly flagged pronunciation drill for an otherwise tiny early lesson pool.",
			),
			{ sourceType: "nonsense" },
		),
	],
	2: [
		createPracticeEntry(
			createWord("ดีด", "to flick / pluck", "diit", "daily", [
				{ thai: "ดีด", sound: "diit" },
			]),
		),
		createPracticeEntry(
			createWord("มี", "to have", "mii", "daily", [{ thai: "มี", sound: "mii" }]),
		),
		createPracticeEntry(
			createWord("มีด", "knife", "miit", "food", [{ thai: "มีด", sound: "miit" }]),
		),
		createPracticeEntry(
			createWord("ดีมาก", "very good", "dii maak", "daily", [
				{ thai: "ดี", sound: "dii" },
				{ thai: "มาก", sound: "maak" },
			]),
			{ sourceType: "phrase" },
		),
		createPracticeEntry(
			createWord("มา", "to come", "maa", "daily", [{ thai: "มา", sound: "maa" }]),
		),
		createPracticeEntry(
			createWord("มาก", "very / a lot", "maak", "daily", [{ thai: "มาก", sound: "maak" }]),
		),
		createPracticeEntry(
			createWord("กา", "crow / kettle / mark", "gaa", "daily", [
				{ thai: "กา", sound: "gaa" },
			]),
		),
	],
	3: [
		createPracticeEntry(
			createWord("นิด", "a little bit", "nit", "daily", [{ thai: "นิด", sound: "nit" }]),
		),
		createPracticeEntry(
			createWord("ดิน", "soil / earth", "din", "daily", [{ thai: "ดิน", sound: "din" }]),
		),
		createPracticeEntry(
			createWord("นา", "rice field", "naa", "place", [{ thai: "นา", sound: "naa" }]),
		),
		createPracticeEntry(
			createWord("นาม", "name / noun", "naam", "sign", [{ thai: "นาม", sound: "naam" }]),
		),
		createPracticeEntry(
			createWord("มี", "to have", "mii", "daily", [{ thai: "มี", sound: "mii" }]),
		),
		createPracticeEntry(
			createWord("ดี", "good", "dii", "daily", [{ thai: "ดี", sound: "dii" }]),
		),
		createPracticeEntry(
			createWord("มีด", "knife", "miit", "food", [{ thai: "มีด", sound: "miit" }]),
		),
		createPracticeEntry(
			createWord("มาก", "very / a lot", "maak", "daily", [{ thai: "มาก", sound: "maak" }]),
		),
	],
	4: [
		createPracticeEntry(
			createWord("ตลก", "funny", "dta-lok", "daily", [
				{ thai: "ตะ", sound: "dta" },
				{ thai: "ลก", sound: "lok" },
			]),
		),
		createPracticeEntry(
			createWord("ตาล", "sugar palm", "dtaan", "daily", [{ thai: "ตาล", sound: "dtaan" }]),
		),
		createPracticeEntry(
			createWord("ตา", "eye", "dtaa", "daily", [{ thai: "ตา", sound: "dtaa" }]),
		),
		createPracticeEntry(
			createWord("ลา", "to leave", "laa", "daily", [{ thai: "ลา", sound: "laa" }]),
		),
		createPracticeEntry(
			createWord("ตี", "to hit", "dtii", "daily", [{ thai: "ตี", sound: "dtii" }]),
		),
		createPracticeEntry(
			createWord("ตาม", "to follow", "dtaam", "daily", [{ thai: "ตาม", sound: "dtaam" }]),
		),
		createPracticeEntry(
			createWord("ลม", "wind / air", "lom", "daily", [{ thai: "ลม", sound: "lom" }]),
		),
		createPracticeEntry(
			createWord("ลด", "to reduce", "lot", "sign", [{ thai: "ลด", sound: "lot" }]),
		),
		createPracticeEntry(
			createWord("ตก", "to fall", "dtok", "daily", [{ thai: "ตก", sound: "dtok" }]),
		),
		createPracticeEntry(
			createWord("มด", "ant", "mot", "daily", [{ thai: "มด", sound: "mot" }]),
		),
	],
	5: [
		createPracticeEntry(
			createWord("กบ", "frog", "gop", "daily", [{ thai: "กบ", sound: "gop" }]),
		),
		createPracticeEntry(
			createWord("ลาบ", "laab salad", "laap", "food", [{ thai: "ลาบ", sound: "laap" }]),
		),
		createPracticeEntry(
			createWord("ดิบ", "raw / unripe", "dip", "food", [{ thai: "ดิบ", sound: "dip" }]),
		),
		createPracticeEntry(
			createWord("บีบ", "to squeeze", "biip", "daily", [{ thai: "บีบ", sound: "biip" }]),
		),
		createPracticeEntry(
			createWord("บาน", "to bloom / open out", "baan", "daily", [
				{ thai: "บาน", sound: "baan" },
			]),
		),
		createPracticeEntry(
			createWord("บด", "to grind", "bot", "food", [{ thai: "บด", sound: "bot" }]),
		),
		createPracticeEntry(
			createWord("บิดา", "father (formal)", "bi-daa", "sign", [
				{ thai: "บิ", sound: "bi" },
				{ thai: "ดา", sound: "daa" },
			]),
		),
		createPracticeEntry(
			createWord("ตลาด", "market", "dta-laat", "place", [
				{ thai: "ตะ", sound: "dta" },
				{ thai: "ลาด", sound: "laat" },
			]),
		),
		createPracticeEntry(
			createWord("ตลก", "funny", "dta-lok", "daily", [
				{ thai: "ตะ", sound: "dta" },
				{ thai: "ลก", sound: "lok" },
			]),
		),
		createPracticeEntry(
			createWord("กิน", "to eat", "gin", "food", [{ thai: "กิน", sound: "gin" }]),
		),
		createPracticeEntry(
			createWord("ดี", "good", "dii", "daily", [{ thai: "ดี", sound: "dii" }]),
			{ tier: "extension" },
		),
		createPracticeEntry(
			createWord("ลด", "to reduce", "lot", "sign", [{ thai: "ลด", sound: "lot" }]),
			{ tier: "extension" },
		),
	],
	6: [
		createPracticeEntry(
			createWord("แต่", "but / however", "dtae", "daily", [{ thai: "แต่", sound: "dtae" }]),
		),
		createPracticeEntry(
			createWord("แก่", "old", "gae", "daily", [{ thai: "แก่", sound: "gae" }]),
		),
		createPracticeEntry(
			createWord("แดด", "sunlight", "daet", "daily", [{ thai: "แดด", sound: "daet" }]),
		),
		createPracticeEntry(
			createWord("แตก", "to break", "dtaek", "daily", [{ thai: "แตก", sound: "dtaek" }]),
		),
		createPracticeEntry(
			createWord("แบน", "flat", "baen", "daily", [{ thai: "แบน", sound: "baen" }]),
		),
		createPracticeEntry(
			createWord("บ่น", "to complain", "bon", "daily", [{ thai: "บ่น", sound: "bon" }]),
		),
		createPracticeEntry(
			createWord("แก", "you (casual)", "gae", "daily", [{ thai: "แก", sound: "gae" }]),
		),
	],
	7: [
		createPracticeEntry(
			createWord("ม้า", "horse", "maa", "daily", [{ thai: "ม้า", sound: "maa" }]),
		),
		createPracticeEntry(
			createWord("บ้าน", "house / home", "baan", "place", [{ thai: "บ้าน", sound: "baan" }]),
		),
		createPracticeEntry(
			createWord("น้า", "aunt / uncle", "naa", "daily", [{ thai: "น้า", sound: "naa" }]),
		),
		createPracticeEntry(
			createWord("ด้าน", "side / aspect", "daan", "sign", [{ thai: "ด้าน", sound: "daan" }]),
		),
		createPracticeEntry(
			createWord("ราด", "to pour over", "raat", "food", [{ thai: "ราด", sound: "raat" }]),
		),
		createPracticeEntry(
			createWord("รีด", "to iron", "riit", "daily", [{ thai: "รีด", sound: "riit" }]),
		),
		createPracticeEntry(
			createWord("รด", "to water", "rot", "daily", [{ thai: "รด", sound: "rot" }]),
		),
		createPracticeEntry(
			createWord("ร้านดี", "good shop", "raan dii", "place", [
				{ thai: "ร้าน", sound: "raan" },
				{ thai: "ดี", sound: "dii" },
			]),
			{ sourceType: "phrase" },
		),
	],
	8: [
		createPracticeEntry(
			createWord("ชา", "tea", "chaa", "food", [{ thai: "ชา", sound: "chaa" }]),
		),
		createPracticeEntry(
			createWord("ชม", "to admire", "chom", "daily", [{ thai: "ชม", sound: "chom" }]),
		),
		createPracticeEntry(
			createWord("ชาม", "bowl", "chaam", "food", [{ thai: "ชาม", sound: "chaam" }]),
		),
		createPracticeEntry(
			createWord("ชิด", "close together", "chit", "daily", [{ thai: "ชิด", sound: "chit" }]),
		),
		createPracticeEntry(
			createWord("ดุ", "fierce / strict", "du", "daily", [{ thai: "ดุ", sound: "du" }]),
		),
		createPracticeEntry(
			createWord("ลุก", "to get up", "luk", "daily", [{ thai: "ลุก", sound: "luk" }]),
		),
		createPracticeEntry(
			createWord("บุก", "to charge in", "buk", "daily", [{ thai: "บุก", sound: "buk" }]),
		),
		createPracticeEntry(
			createWord("นุ่ม", "soft", "num", "daily", [{ thai: "นุ่ม", sound: "num" }]),
		),
		createPracticeEntry(
			createWord("ตลก", "funny", "dta-lok", "daily", [
				{ thai: "ตะ", sound: "dta" },
				{ thai: "ลก", sound: "lok" },
			]),
			{ tier: "extension" },
		),
		createPracticeEntry(
			createWord("ตลาด", "market", "dta-laat", "place", [
				{ thai: "ตะ", sound: "dta" },
				{ thai: "ลาด", sound: "laat" },
			]),
			{ tier: "extension" },
		),
		createPracticeEntry(
			createWord("ม้า", "horse", "maa", "daily", [{ thai: "ม้า", sound: "maa" }]),
			{ tier: "extension" },
		),
		createPracticeEntry(
			createWord("ร้าน", "shop", "raan", "place", [{ thai: "ร้าน", sound: "raan" }]),
			{ tier: "extension" },
		),
	],
	9: [
		createPracticeEntry(
			createWord("สี", "color", "sii", "daily", [{ thai: "สี", sound: "sii" }]),
		),
		createPracticeEntry(
			createWord("สาม", "three", "saam", "sign", [{ thai: "สาม", sound: "saam" }]),
		),
		createPracticeEntry(
			createWord("ส้ม", "orange", "som", "food", [{ thai: "ส้ม", sound: "som" }]),
		),
		createPracticeEntry(
			createWord("สนุก", "fun", "sa-nuk", "daily", [
				{ thai: "สะ", sound: "sa" },
				{ thai: "นุก", sound: "nuk" },
			]),
		),
		createPracticeEntry(
			createWord("สุด", "most / end", "sut", "daily", [{ thai: "สุด", sound: "sut" }]),
		),
		createPracticeEntry(
			createWord("สด", "fresh", "sot", "food", [{ thai: "สด", sound: "sot" }]),
		),
		createPracticeEntry(
			createWord("สมุด", "notebook", "sa-mut", "sign", [
				{ thai: "สะ", sound: "sa" },
				{ thai: "มุด", sound: "mut" },
			]),
		),
		createPracticeEntry(
			createWord("สามสิบ", "thirty", "saam sip", "sign", [
				{ thai: "สาม", sound: "saam" },
				{ thai: "สิบ", sound: "sip" },
			]),
			{ tier: "extension", sourceType: "phrase" },
		),
		createPracticeEntry(
			createWord("ส้มสด", "fresh oranges", "som sot", "food", [
				{ thai: "ส้ม", sound: "som" },
				{ thai: "สด", sound: "sot" },
			]),
			{ tier: "extension", sourceType: "phrase" },
		),
	],
	10: [
		createPracticeEntry(
			createWord("ขวา", "right side", "khwaa", "sign", [{ thai: "ขวา", sound: "khwaa" }]),
		),
		createPracticeEntry(
			createWord("ข่าว", "news", "khaao", "sign", [{ thai: "ข่าว", sound: "khaao" }]),
		),
		createPracticeEntry(
			createWord("ขาว", "white", "khaao", "daily", [{ thai: "ขาว", sound: "khaao" }]),
		),
		createPracticeEntry(
			createWord("ขวด", "bottle", "khuat", "daily", [{ thai: "ขวด", sound: "khuat" }]),
		),
		createPracticeEntry(
			createWord("ขา", "leg", "khaa", "daily", [{ thai: "ขา", sound: "khaa" }]),
		),
		createPracticeEntry(
			createWord("ขม", "bitter", "khom", "food", [{ thai: "ขม", sound: "khom" }]),
		),
		createPracticeEntry(
			createWord("ขาด", "to lack / be torn", "khaat", "daily", [
				{ thai: "ขาด", sound: "khaat" },
			]),
		),
		createPracticeEntry(
			createWord("วาด", "to draw", "waat", "daily", [{ thai: "วาด", sound: "waat" }]),
		),
		createPracticeEntry(
			createWord("ว่า", "to say / that", "waa", "daily", [{ thai: "ว่า", sound: "waa" }]),
		),
		createPracticeEntry(
			createWord("ดาว", "star", "daao", "daily", [{ thai: "ดาว", sound: "daao" }]),
		),
		createPracticeEntry(
			createWord("สวน", "garden / park", "suan", "place", [{ thai: "สวน", sound: "suan" }]),
			{ tier: "extension" },
		),
		createPracticeEntry(
			createWord("ข้าวขาว", "white rice", "khaao khaao", "food", [
				{ thai: "ข้าว", sound: "khaao" },
				{ thai: "ขาว", sound: "khaao" },
			]),
			{ tier: "extension", sourceType: "phrase" },
		),
	],
	11: [
		createPracticeEntry(
			createWord("หู", "ear", "huu", "daily", [{ thai: "หู", sound: "huu" }]),
		),
		createPracticeEntry(
			createWord("หมา", "dog", "maa", "daily", [{ thai: "หมา", sound: "maa" }]),
		),
		createPracticeEntry(
			createWord("หา", "to look for", "haa", "daily", [{ thai: "หา", sound: "haa" }]),
		),
		createPracticeEntry(
			createWord("รู้", "to know", "ruu", "daily", [{ thai: "รู้", sound: "ruu" }]),
		),
		createPracticeEntry(
			createWord("ดู", "to watch", "duu", "daily", [{ thai: "ดู", sound: "duu" }]),
		),
		createPracticeEntry(
			createWord("หิว", "hungry", "hiw", "daily", [{ thai: "หิว", sound: "hiw" }]),
		),
		createPracticeEntry(
			createWord("หมด", "all gone", "mot", "daily", [{ thai: "หมด", sound: "mot" }]),
		),
		createPracticeEntry(
			createWord("ลูก", "child", "luuk", "daily", [{ thai: "ลูก", sound: "luuk" }]),
		),
		createPracticeEntry(
			createWord("ตู้", "cabinet", "tuu", "place", [{ thai: "ตู้", sound: "tuu" }]),
		),
		createPracticeEntry(
			createWord("สู้", "to fight", "suu", "daily", [{ thai: "สู้", sound: "suu" }]),
		),
		createPracticeEntry(
			createWord("หวาน", "sweet", "waan", "food", [{ thai: "หวาน", sound: "waan" }]),
			{ tier: "extension" },
		),
		createPracticeEntry(
			createWord("ห้าม", "forbidden / do not", "haam", "sign", [
				{ thai: "ห้าม", sound: "haam" },
			]),
			{ tier: "extension" },
		),
		createPracticeEntry(
			createWord("หิวมาก", "very hungry", "hiw maak", "daily", [
				{ thai: "หิว", sound: "hiw" },
				{ thai: "มาก", sound: "maak" },
			]),
			{ tier: "extension", sourceType: "phrase" },
		),
		createPracticeEntry(
			createWord("หมูสด", "fresh pork", "muu sot", "food", [
				{ thai: "หมู", sound: "muu" },
				{ thai: "สด", sound: "sot" },
			]),
			{ tier: "extension", sourceType: "phrase" },
		),
	],
	12: [
		createPracticeEntry(
			createWord("ออก", "to exit / go out", "awk", "sign", [{ thai: "ออก", sound: "awk" }]),
		),
		createPracticeEntry(
			createWord("ขอ", "to ask for", "khaaw", "daily", [{ thai: "ขอ", sound: "khaaw" }]),
		),
		createPracticeEntry(
			createWord("ชอบ", "to like", "chaawp", "daily", [{ thai: "ชอบ", sound: "chaawp" }]),
		),
		createPracticeEntry(
			createWord("ร้อน", "hot", "raawn", "daily", [{ thai: "ร้อน", sound: "raawn" }]),
		),
		createPracticeEntry(
			createWord("รอ", "to wait", "raaw", "daily", [{ thai: "รอ", sound: "raaw" }]),
		),
		createPracticeEntry(
			createWord("บอก", "to tell", "baawk", "daily", [{ thai: "บอก", sound: "baawk" }]),
		),
		createPracticeEntry(
			createWord("หมอ", "doctor", "maaw", "daily", [{ thai: "หมอ", sound: "maaw" }]),
		),
		createPracticeEntry(
			createWord("ดอก", "flower", "daawk", "daily", [{ thai: "ดอก", sound: "daawk" }]),
		),
		createPracticeEntry(
			createWord("หอม", "fragrant", "haawm", "daily", [{ thai: "หอม", sound: "haawm" }]),
		),
		createPracticeEntry(
			createWord("ตอบ", "to answer", "dtaawp", "daily", [{ thai: "ตอบ", sound: "dtaawp" }]),
		),
		createPracticeEntry(
			createWord("อ้วน", "fat / overweight", "uuan", "daily", [
				{ thai: "อ้วน", sound: "uuan" },
			]),
			{ tier: "extension" },
		),
		createPracticeEntry(
			createWord("ขอชา", "may I have tea", "khaaw chaa", "food", [
				{ thai: "ขอ", sound: "khaaw" },
				{ thai: "ชา", sound: "chaa" },
			]),
			{ tier: "extension", sourceType: "phrase" },
		),
		createPracticeEntry(
			createWord("ชอบมาก", "like very much", "chaawp maak", "daily", [
				{ thai: "ชอบ", sound: "chaawp" },
				{ thai: "มาก", sound: "maak" },
			]),
			{ tier: "extension", sourceType: "phrase" },
		),
	],
	13: [
		createPracticeEntry(
			createWord("ผัก", "vegetables", "phak", "food", [{ thai: "ผัก", sound: "phak" }]),
		),
		createPracticeEntry(
			createWord("ผม", "I / hair", "phom", "daily", [{ thai: "ผม", sound: "phom" }]),
		),
		createPracticeEntry(
			createWord("รัก", "to love", "rak", "daily", [{ thai: "รัก", sound: "rak" }]),
		),
		createPracticeEntry(
			createWord("วัน", "day", "wan", "sign", [{ thai: "วัน", sound: "wan" }]),
		),
		createPracticeEntry(
			createWord("มัน", "it / oily", "man", "daily", [{ thai: "มัน", sound: "man" }]),
		),
		createPracticeEntry(
			createWord("วัด", "temple / to measure", "wat", "place", [
				{ thai: "วัด", sound: "wat" },
			]),
		),
		createPracticeEntry(
			createWord("รับ", "to receive", "rap", "daily", [{ thai: "รับ", sound: "rap" }]),
		),
		createPracticeEntry(
			createWord("ขับ", "to drive", "khap", "daily", [{ thai: "ขับ", sound: "khap" }]),
		),
		createPracticeEntry(
			createWord("หัว", "head", "hua", "daily", [{ thai: "หัว", sound: "hua" }]),
		),
		createPracticeEntry(
			createWord("ตับ", "liver", "dtap", "food", [{ thai: "ตับ", sound: "dtap" }]),
		),
		createPracticeEntry(
			createWord("สั้น", "short", "san", "daily", [{ thai: "สั้น", sound: "san" }]),
			{ tier: "extension" },
		),
		createPracticeEntry(
			createWord("ผ้า", "cloth", "phaa", "daily", [{ thai: "ผ้า", sound: "phaa" }]),
			{ tier: "extension" },
		),
		createPracticeEntry(
			createWord("ผี", "ghost", "phii", "daily", [{ thai: "ผี", sound: "phii" }]),
			{ tier: "extension" },
		),
		createPracticeEntry(
			createWord("ตัว", "body / self", "dtua", "daily", [{ thai: "ตัว", sound: "dtua" }]),
			{ tier: "extension" },
		),
		createPracticeEntry(
			createWord("ผัดผัก", "stir-fried vegetables", "phat phak", "food", [
				{ thai: "ผัด", sound: "phat" },
				{ thai: "ผัก", sound: "phak" },
			]),
			{ tier: "extension", sourceType: "phrase" },
		),
		createPracticeEntry(
			createWord("ผมหิว", "I am hungry", "phom hiw", "daily", [
				{ thai: "ผม", sound: "phom" },
				{ thai: "หิว", sound: "hiw" },
			]),
			{ tier: "extension", sourceType: "phrase" },
		),
		createPracticeEntry(
			createWord("รักแม่", "to love mom", "rak mae", "daily", [
				{ thai: "รัก", sound: "rak" },
				{ thai: "แม่", sound: "mae" },
			]),
			{ tier: "extension", sourceType: "phrase" },
		),
	],
};

const lessons: Lesson[] = baseLessons.map((lesson) => {
	const practiceVocabulary = practiceVocabularyByLessonId[lesson.id] ?? [];

	return {
		...lesson,
		vocabulary: practiceVocabulary,
	};
});

/** The complete Thai language pack exported for use by the app */
export const thaiPack: LanguagePack = {
	id: "thai",
	name: "Thai",
	nativeName: "ภาษาไทย",
	direction: "ltr",
	lessons,
};
