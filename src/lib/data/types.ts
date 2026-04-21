/**
 * Represents a single Thai letter (consonant, vowel, or tone mark) that the learner
 * encounters during a lesson. Each letter includes learning aids such as a mnemonic
 * and pronunciation guide.
 */
export interface Letter {
	/** The Thai character itself (e.g. 'ห', 'ั', 'ว') */
	character: string;
	/** Romanized transliteration of the character (e.g. 'h', 'a', 'w') */
	romanization: string;
	/** Human-friendly pronunciation guide (e.g. 'h as in "hello"') */
	pronunciation: string;
	/** Classification of the letter within the Thai writing system */
	type: "consonant" | "vowel" | "tone_mark";
	/** Consonant class used in Thai tone rules; only applicable to consonants */
	class?: "low" | "mid" | "high";
	/** A memorable visual or conceptual association to help the learner remember the character */
	mnemonic: string;
	/** Where this character is written relative to its associated consonant */
	position?: "left" | "right" | "above" | "below" | "around" | "standalone";
}

/**
 * Breaks a Thai word into its constituent syllable parts, mapping each
 * Thai text fragment to its phonetic sound. Used to teach learners how
 * multi-syllable words are decomposed and pronounced.
 */
export interface SyllableBreakdown {
	/** The Thai script fragment for this syllable portion */
	thai: string;
	/** The phonetic sound this fragment produces */
	sound: string;
}

/**
 * A phonetic or orthographic rule introduced in a lesson (e.g. hidden vowels,
 * final consonant reduction). Rules help learners understand patterns rather
 * than memorizing words in isolation.
 */
export interface Rule {
	/** Unique identifier for this rule (e.g. 'leading-h', 'hidden-vowel') */
	id: string;
	/** Short human-readable name displayed as the rule heading */
	name: string;
	/** One-line summary shown in compact views or tooltips */
	shortDescription: string;
	/** Full pedagogical explanation of the rule */
	explanation: string;
	/** Concrete Thai examples demonstrating the rule in action */
	examples: string[];
}

/**
 * A multiple-choice drill question used to reinforce letter recognition,
 * pronunciation, meaning, and visual identification skills.
 */
export interface DrillQuestion {
	/**
	 * The kind of drill:
	 * - 'recognize': identify a letter by its sound
	 * - 'match': match a Thai word to its meaning
	 * - 'sound': choose the correct pronunciation
	 * - 'spot': visually identify the correct word among look-alikes
	 */
	type: "recognize" | "match" | "sound" | "spot";
	/** The question text shown to the learner */
	prompt: string;
	/** The answer choices displayed as buttons or cards */
	options: string[];
	/** Zero-based index of the correct answer within the options array */
	correctIndex: number;
	/** Optional hint shown after an incorrect attempt */
	hint?: string;
}

/**
 * A Thai vocabulary word used as the anchor for a lesson. Each word is broken
 * into syllables and accompanied by real-world context to make it memorable.
 */
export interface Word {
	/** The word written in Thai script */
	thai: string;
	/** English translation or gloss */
	meaning: string;
	/** Romanized pronunciation with tone markers */
	pronunciation: string;
	/** Thematic category the word belongs to, used for grouping and review */
	category: "place" | "food" | "transport" | "daily" | "sign";
	/** Syllable-by-syllable breakdown for step-by-step reading practice */
	syllables: SyllableBreakdown[];
	/** Real-world context explaining where and how a learner would encounter this word */
	contextNote?: string;
}

/**
 * A single lesson in the curriculum. Each lesson is anchored around one real-world
 * Thai word, introduces new letters and reading rules, and concludes with
 * interactive drills.
 */
export interface Lesson {
	/** Unique numeric identifier for the lesson, used for ordering and progress tracking */
	id: number;
	/** The curriculum stage this lesson belongs to (lessons progress through stages sequentially) */
	stage: number;
	/** Display title shown in the lesson list and header (e.g. 'Hua Hin -- Your First Thai Word') */
	title: string;
	/** The focal vocabulary word that the lesson is built around */
	anchorWord: Word;
	/** New Thai letters introduced for the first time in this lesson */
	newLetters: Letter[];
	/** Phonetic or orthographic rules taught in this lesson */
	rulesIntroduced: Rule[];
	/** Interactive multiple-choice drills to practice the lesson material */
	drills: DrillQuestion[];
	/** Characters from previous lessons to reinforce through spaced review */
	reviewLetters?: string[];
}

/**
 * Tracks a learner's completion status and performance for a single lesson.
 * Stored as part of the overall AppProgress.
 */
export interface LessonProgress {
	/** The ID of the lesson this progress record corresponds to */
	lessonId: number;
	/** Whether the learner has finished this lesson */
	completed: boolean;
	/** The learner's score on the drill section (number of correct answers) */
	drillScore?: number;
	/** ISO 8601 timestamp of when the lesson was completed */
	completedAt?: string;
}

/**
 * The top-level progress state for the entire application. Persisted to
 * localStorage so learners can resume where they left off.
 */
export interface AppProgress {
	/** All Thai characters the learner has encountered and practiced so far */
	knownLetters: string[];
	/** All anchor words the learner has completed lessons for */
	knownWords: Word[];
	/** Per-lesson completion records with scores and timestamps */
	lessonProgress: LessonProgress[];
	/** The ID of the lesson the learner should see next (or is currently on) */
	currentLessonId: number;
}

/** Versioned persistence wrapper for local progress snapshots stored on the client */
export interface ProgressSnapshotV1 {
	/** Storage schema version for this snapshot payload */
	version: 1;
	/** Normalized learner progress payload */
	progress: AppProgress;
}

/** Current union of supported persisted progress snapshot shapes */
export type ProgressSnapshot = ProgressSnapshotV1;

/**
 * A complete language curriculum package. The app is designed to support multiple
 * languages in the future; each language provides its own pack with lessons.
 */
export interface LanguagePack {
	/** Unique identifier for the language pack (e.g. 'thai') */
	id: string;
	/** English name of the language (e.g. 'Thai') */
	name: string;
	/** The language name written in its own script (e.g. 'ภาษาไทย') */
	nativeName: string;
	/** Text direction: left-to-right or right-to-left */
	direction: "ltr" | "rtl";
	/** The ordered sequence of lessons in this curriculum */
	lessons: Lesson[];
}
