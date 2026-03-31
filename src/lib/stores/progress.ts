/**
 * Progress Store
 *
 * Manages the learner's progress state using Svelte stores backed by localStorage.
 * Provides writable and derived stores for tracking known letters, known words,
 * lesson completion, and the current lesson. All mutations auto-persist to localStorage.
 */
import { writable, derived, get } from 'svelte/store';
import type { AppProgress, Word, LessonProgress } from '$lib/data/types';
import { thaiPack } from '$lib/data/thai';

/** localStorage key under which the serialized progress JSON is stored */
const STORAGE_KEY = 'sparkscripts_progress';

/** Returns a blank AppProgress object representing a brand-new learner */
function createInitialProgress(): AppProgress {
	return {
		knownLetters: [],
		knownWords: [],
		lessonProgress: [],
		currentLessonId: 1
	};
}

/** Loads saved progress from localStorage, falling back to initial state on failure or SSR */
function loadProgress(): AppProgress {
	if (typeof window === 'undefined') return createInitialProgress();
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) return JSON.parse(stored);
	} catch {
		// ignore parse errors
	}
	return createInitialProgress();
}

/** Persists the current progress state to localStorage; silently no-ops during SSR */
function saveProgress(progress: AppProgress) {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
	} catch {
		// ignore storage errors
	}
}

/** The primary writable store holding the full AppProgress state */
export const progress = writable<AppProgress>(createInitialProgress());

/**
 * Initializes the progress store by loading saved state from localStorage
 * and subscribing to future changes so they are automatically persisted.
 * Should be called once when the app mounts on the client side.
 */
export function initProgress() {
	const loaded = loadProgress();
	progress.set(loaded);
	progress.subscribe(saveProgress);
}

/** Derived store: array of all Thai characters the learner has encountered */
export const knownLetters = derived(progress, ($p) => $p.knownLetters);
/** Derived store: array of all anchor words from completed lessons */
export const knownWords = derived(progress, ($p) => $p.knownWords);
/** Derived store: the numeric ID of the learner's current (or next) lesson */
export const currentLessonId = derived(progress, ($p) => $p.currentLessonId);

/** Derived store: the full Lesson object for the learner's current lesson, falling back to lesson 1 */
export const currentLesson = derived(progress, ($p) => {
	return thaiPack.lessons.find((l) => l.id === $p.currentLessonId) ?? thaiPack.lessons[0];
});

/** Total number of lessons available in the Thai curriculum */
export const totalLessons = thaiPack.lessons.length;

/**
 * Marks a lesson as completed and updates the learner's progress.
 * This function:
 *   1. Adds any newly introduced letters to the known letters list
 *   2. Adds the lesson's anchor word to the known words list
 *   3. Records (or updates) the lesson's completion status and drill score
 *   4. Advances the current lesson pointer to the next available lesson
 *
 * @param lessonId - The ID of the lesson being completed
 * @param drillScore - The learner's score on the drill section
 */
export function completeLesson(lessonId: number, drillScore: number) {
	progress.update(($p) => {
		const lesson = thaiPack.lessons.find((l) => l.id === lessonId);
		if (!lesson) return $p;

		// Add new letters
		const newLetters = lesson.newLetters
			.map((l) => l.character)
			.filter((c) => !$p.knownLetters.includes(c));
		$p.knownLetters = [...$p.knownLetters, ...newLetters];

		// Add word
		if (!$p.knownWords.find((w) => w.thai === lesson.anchorWord.thai)) {
			$p.knownWords = [...$p.knownWords, lesson.anchorWord];
		}

		// Update lesson progress
		const existing = $p.lessonProgress.findIndex((lp) => lp.lessonId === lessonId);
		const lp: LessonProgress = {
			lessonId,
			completed: true,
			drillScore,
			completedAt: new Date().toISOString()
		};
		if (existing >= 0) {
			$p.lessonProgress[existing] = lp;
		} else {
			$p.lessonProgress = [...$p.lessonProgress, lp];
		}

		// Advance to next lesson
		const nextLesson = thaiPack.lessons.find((l) => l.id > lessonId);
		if (nextLesson) {
			$p.currentLessonId = nextLesson.id;
		}

		return $p;
	});
}

/**
 * Checks whether a specific lesson has been completed by the learner.
 * Reads the current store value synchronously via `get()`.
 *
 * @param lessonId - The ID of the lesson to check
 * @returns true if the lesson is marked as completed
 */
export function isLessonCompleted(lessonId: number): boolean {
	const $p = get(progress);
	return $p.lessonProgress.some((lp) => lp.lessonId === lessonId && lp.completed);
}

/**
 * Determines whether a lesson is unlocked and available to the learner.
 * Lesson 1 is always unlocked; subsequent lessons require the previous lesson
 * to be completed.
 *
 * @param lessonId - The ID of the lesson to check
 * @returns true if the learner is allowed to start this lesson
 */
export function isLessonUnlocked(lessonId: number): boolean {
	const $p = get(progress);
	if (lessonId === 1) return true;
	return $p.lessonProgress.some((lp) => lp.lessonId === lessonId - 1 && lp.completed);
}

export function resetProgress() {
	progress.set(createInitialProgress());
}
