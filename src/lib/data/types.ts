export interface Letter {
	character: string;
	romanization: string;
	pronunciation: string;
	type: 'consonant' | 'vowel' | 'tone_mark';
	class?: 'low' | 'mid' | 'high'; // consonant class for tones
	mnemonic: string;
	position?: 'left' | 'right' | 'above' | 'below' | 'around' | 'standalone';
}

export interface SyllableBreakdown {
	thai: string;
	sound: string;
}

export interface Rule {
	id: string;
	name: string;
	shortDescription: string;
	explanation: string;
	examples: string[];
}

export interface DrillQuestion {
	type: 'recognize' | 'match' | 'sound' | 'spot';
	prompt: string;
	options: string[];
	correctIndex: number;
	hint?: string;
}

export interface Word {
	thai: string;
	meaning: string;
	pronunciation: string;
	category: 'place' | 'food' | 'transport' | 'daily' | 'sign';
	syllables: SyllableBreakdown[];
	contextNote?: string;
}

export interface Lesson {
	id: number;
	stage: number;
	title: string;
	anchorWord: Word;
	newLetters: Letter[];
	rulesIntroduced: Rule[];
	drills: DrillQuestion[];
	reviewLetters?: string[]; // characters from previous lessons to reinforce
}

export interface LessonProgress {
	lessonId: number;
	completed: boolean;
	drillScore?: number;
	completedAt?: string;
}

export interface AppProgress {
	knownLetters: string[];
	knownWords: Word[];
	lessonProgress: LessonProgress[];
	currentLessonId: number;
}

export interface LanguagePack {
	id: string;
	name: string;
	nativeName: string;
	direction: 'ltr' | 'rtl';
	lessons: Lesson[];
}
