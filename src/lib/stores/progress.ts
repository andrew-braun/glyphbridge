/**
 * Progress Store
 *
 * Manages the learner's progress state using Svelte stores backed by localStorage.
 * Provides writable and derived stores for tracking known letters, known words,
 * lesson completion, and the current lesson. All mutations auto-persist to localStorage.
 */
import { derived, get, type Unsubscriber, writable } from "svelte/store";

import { thaiPack } from "$lib/data/thai";
import type {
	AppProgress,
	LessonProgress,
	ProgressSnapshot,
	ProgressSnapshotV2,
	Word,
} from "$lib/data/types";

/** localStorage key under which the serialized progress JSON is stored */
const STORAGE_KEY = "glyphbridge_progress";
const STORAGE_VERSION = 2;

const lessons = thaiPack.lessons;
const firstLessonId = lessons[0]?.id ?? 1;
const lessonIds = lessons.map((lesson) => lesson.id);
const lastLessonId = lessonIds[lessonIds.length - 1] ?? firstLessonId;
const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
const knownLetterCharacters = new Set(
	lessons.flatMap((lesson) => lesson.newLetters.map((letter) => letter.character)),
);
const knownWordThaiMap = new Map(
	lessons.map((lesson) => [lesson.anchorWord.thai, lesson.anchorWord]),
);

/** Returns a blank AppProgress object representing a brand-new learner */
function createInitialProgress(): AppProgress {
	return {
		knownLetters: [],
		knownWords: [],
		lessonProgress: [],
		currentLessonId: firstLessonId,
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function normalizeLessonId(value: unknown): number | null {
	if (typeof value !== "number" || !Number.isInteger(value)) return null;
	return lessonById.has(value) ? value : null;
}

function normalizeKnownLetters(value: unknown): string[] {
	if (!Array.isArray(value)) return [];

	const seen = new Set<string>();
	const normalized: string[] = [];

	for (const item of value) {
		if (typeof item === "string" && knownLetterCharacters.has(item) && !seen.has(item)) {
			seen.add(item);
			normalized.push(item);
		}
	}

	return normalized;
}

function normalizeKnownWords(value: unknown): Word[] {
	if (!Array.isArray(value)) return [];

	const seen = new Set<string>();
	const normalized: Word[] = [];

	for (const item of value) {
		if (!isRecord(item) || typeof item.thai !== "string") continue;

		const canonicalWord = knownWordThaiMap.get(item.thai);
		if (!canonicalWord || seen.has(canonicalWord.thai)) continue;

		seen.add(canonicalWord.thai);
		normalized.push(canonicalWord);
	}

	return normalized;
}

function normalizeDrillScore(value: unknown): number | undefined {
	if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
	return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeCompletedAt(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined;
	return Number.isNaN(Date.parse(value)) ? undefined : value;
}

function normalizeLessonProgress(value: unknown): LessonProgress[] {
	if (!Array.isArray(value)) return [];

	const byLessonId = new Map<number, LessonProgress>();

	for (const item of value) {
		if (!isRecord(item)) continue;

		const lessonId = normalizeLessonId(item.lessonId);
		if (lessonId === null) continue;

		const normalizedEntry: LessonProgress = {
			lessonId,
			completed: item.completed === true,
		};

		const drillScore = normalizeDrillScore(item.drillScore);
		if (drillScore !== undefined) {
			normalizedEntry.drillScore = drillScore;
		}

		const completedAt = normalizeCompletedAt(item.completedAt);
		if (completedAt) {
			normalizedEntry.completedAt = completedAt;
		}

		byLessonId.set(lessonId, normalizedEntry);
	}

	return Array.from(byLessonId.values()).sort((left, right) => {
		return left.lessonId - right.lessonId;
	});
}

function collectKnownLetters(
	storedKnownLetters: string[],
	lessonProgress: LessonProgress[],
): string[] {
	const completedLessonIds = new Set(
		lessonProgress.filter((entry) => entry.completed).map((entry) => entry.lessonId),
	);
	const storedLetterSet = new Set(storedKnownLetters);
	const normalized: string[] = [];

	for (const lesson of lessons) {
		for (const letter of lesson.newLetters) {
			if (!completedLessonIds.has(lesson.id) && !storedLetterSet.has(letter.character)) {
				continue;
			}

			if (!normalized.includes(letter.character)) {
				normalized.push(letter.character);
			}
		}
	}

	return normalized;
}

function collectKnownWords(storedKnownWords: Word[], lessonProgress: LessonProgress[]): Word[] {
	const completedLessonIds = new Set(
		lessonProgress.filter((entry) => entry.completed).map((entry) => entry.lessonId),
	);
	const storedWordSet = new Set(storedKnownWords.map((word) => word.thai));
	const normalized: Word[] = [];

	for (const lesson of lessons) {
		if (!completedLessonIds.has(lesson.id) && !storedWordSet.has(lesson.anchorWord.thai)) {
			continue;
		}

		normalized.push(lesson.anchorWord);
	}

	return normalized;
}

function getCurrentLessonIdFromProgress(lessonProgress: LessonProgress[]): number {
	const completedLessonIds = new Set(
		lessonProgress.filter((entry) => entry.completed).map((entry) => entry.lessonId),
	);

	for (const lessonId of lessonIds) {
		if (!completedLessonIds.has(lessonId)) {
			return lessonId;
		}
	}

	return lastLessonId;
}

function normalizeProgress(value: unknown): AppProgress {
	if (!isRecord(value)) return createInitialProgress();

	const lessonProgress = normalizeLessonProgress(value.lessonProgress);

	return {
		knownLetters: collectKnownLetters(
			normalizeKnownLetters(value.knownLetters),
			lessonProgress,
		),
		knownWords: collectKnownWords(normalizeKnownWords(value.knownWords), lessonProgress),
		lessonProgress,
		currentLessonId: getCurrentLessonIdFromProgress(lessonProgress),
	};
}

function normalizeSnapshot(value: unknown): ProgressSnapshot | null {
	if (!isRecord(value)) return null;

	if (value.version === STORAGE_VERSION) {
		return {
			version: STORAGE_VERSION,
			progress: normalizeProgress(value.progress),
		};
	}

	if ("version" in value) {
		return null;
	}

	return null;
}

function createSnapshot(progress: AppProgress): ProgressSnapshotV2 {
	return {
		version: STORAGE_VERSION,
		progress: normalizeProgress(progress),
	};
}

/** Loads saved progress from localStorage, falling back to initial state on failure or SSR */
function loadProgress(): AppProgress {
	if (typeof window === "undefined") return createInitialProgress();
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return createInitialProgress();

		const snapshot = normalizeSnapshot(JSON.parse(stored));
		if (snapshot) return snapshot.progress;
	} catch {
		// ignore parse errors
	}
	return createInitialProgress();
}

/** Persists the current progress state to localStorage; silently no-ops during SSR */
function saveProgress(progress: AppProgress) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(createSnapshot(progress)));
	} catch {
		// ignore storage errors
	}
}

/** The primary writable store holding the full AppProgress state */
export const progress = writable<AppProgress>(createInitialProgress());

let hasInitializedProgress = false;
let persistProgressUnsubscribe: Unsubscriber | null = null;

/**
 * Initializes the progress store by loading saved state from localStorage
 * and subscribing to future changes so they are automatically persisted.
 * The store self-initializes in the browser so routes can rely on it without
 * an explicit layout-level lifecycle hook.
 */
function ensureProgressInitialized() {
	if (typeof window === "undefined") return;
	if (hasInitializedProgress) return;
	hasInitializedProgress = true;

	progress.set(loadProgress());
	persistProgressUnsubscribe ??= progress.subscribe(saveProgress);
}

ensureProgressInitialized();

/** Derived store: array of all Thai characters the learner has encountered */
export const knownLetters = derived(progress, ($p) => $p.knownLetters);
/** Derived store: array of all anchor words from completed lessons */
export const knownWords = derived(progress, ($p) => $p.knownWords);
/** Derived store: the numeric ID of the learner's current (or next) lesson */
export const currentLessonId = derived(progress, ($p) => $p.currentLessonId);

/** Total number of lessons available in the Thai curriculum */
export const totalLessons = lessons.length;

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
		const lesson = lessonById.get(lessonId);
		if (!lesson) return $p;

		const knownLetters = [...$p.knownLetters];
		for (const letter of lesson.newLetters) {
			if (!knownLetters.includes(letter.character)) {
				knownLetters.push(letter.character);
			}
		}

		const knownWords = $p.knownWords.find((word) => word.thai === lesson.anchorWord.thai)
			? $p.knownWords
			: [...$p.knownWords, lesson.anchorWord];

		const lessonProgressEntry: LessonProgress = {
			lessonId,
			completed: true,
			drillScore: Math.max(0, Math.min(100, Math.round(drillScore))),
			completedAt: new Date().toISOString(),
		};

		const lessonProgress = [
			...$p.lessonProgress.filter((entry) => entry.lessonId !== lessonId),
			lessonProgressEntry,
		].sort((left, right) => left.lessonId - right.lessonId);

		const nextLesson = lessons.find((candidate) => candidate.id > lessonId);
		const nextLessonId = nextLesson?.id ?? lesson.id;

		return {
			knownLetters,
			knownWords,
			lessonProgress,
			currentLessonId: Math.max($p.currentLessonId, nextLessonId),
		};
	});
}

/**
 * Checks whether a specific lesson has been completed by the learner.
 * Reads the current store value synchronously via `get()`.
 *
 * @param lessonId - The ID of the lesson to check
 * @returns true if the lesson is marked as completed
 */
function isLessonCompleted(lessonId: number): boolean {
	const $p = get(progress);
	return $p.lessonProgress.some((entry) => entry.lessonId === lessonId && entry.completed);
}
