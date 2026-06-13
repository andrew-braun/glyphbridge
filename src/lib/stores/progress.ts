import { derived, type Unsubscriber, writable } from "svelte/store";

import type { LearnerProjection } from "$lib/data/learner";
import { thaiPack } from "$lib/data/thai";
import type {
	AppProgress,
	LessonProgress,
	LessonVocabularyEntry,
	ProgressSnapshot,
	ProgressSnapshotV3,
	Word,
} from "$lib/data/types";

const STORAGE_KEY = "glyphbridge_progress";
const STORAGE_VERSION = 3;

export const PRACTICE_PASS_PERCENT = 60;

export type LessonJourneyPhase = "learn" | "practice" | "review";

export type LessonJourneyState = {
	lessonId: number;
	learnUnlocked: boolean;
	practiceUnlocked: boolean;
	learningCompleted: boolean;
	practicePassed: boolean;
	practiceAttempts: number;
	bestPracticeScore?: number;
	latestPracticeScore?: number;
	isCurrent: boolean;
	currentPhase: Exclude<LessonJourneyPhase, "review"> | null;
};

export type ResumeTarget = {
	lessonId: number | null;
	phase: LessonJourneyPhase;
	href: string;
};

export type LessonPracticeAttemptResult = {
	completedAt: string;
	entry: LessonProgress;
	practicePassed: boolean;
	shouldSync: boolean;
};

const lessons = thaiPack.lessons;
const firstLessonId = lessons[0]?.id ?? 1;
const lessonIds = lessons.map((lesson) => lesson.id);
const lastLessonId = lessonIds[lessonIds.length - 1] ?? firstLessonId;
const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
const knownLetterCharacters = new Set(
	lessons.flatMap((lesson) => lesson.newLetters.map((letter) => letter.character)),
);

function countsAsKnownWord(entry: LessonVocabularyEntry): boolean {
	return entry.sourceType !== "nonsense";
}

function getCanonicalLessonWords(lessonId: number): Word[] {
	const lesson = lessonById.get(lessonId);
	if (!lesson) return [];

	return [
		lesson.anchorWord,
		...lesson.vocabulary.filter(countsAsKnownWord).map((entry) => entry.word),
	];
}

const knownWordThaiMap = new Map(
	lessons
		.flatMap((lesson) => getCanonicalLessonWords(lesson.id))
		.map((word) => [word.thai, word] as const),
);

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

function normalizeScore(value: unknown): number | undefined {
	if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
	return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeNonNegativeInteger(value: unknown): number | undefined {
	if (typeof value !== "number" || !Number.isInteger(value) || value < 0) return undefined;
	return value;
}

function normalizeTimestamp(value: unknown): string | undefined {
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

		const legacyCompletedAt = normalizeTimestamp(item.completedAt);
		const legacyDrillScore = normalizeScore(item.drillScore);

		let learningCompletedAt = normalizeTimestamp(item.learningCompletedAt) ?? legacyCompletedAt;
		const practicePassedAt = normalizeTimestamp(item.practicePassedAt) ?? legacyCompletedAt;
		const bestPracticeScore = normalizeScore(item.bestPracticeScore ?? legacyDrillScore);
		const latestPracticeScore = normalizeScore(item.latestPracticeScore ?? legacyDrillScore);

		let learningCompleted =
			item.learningCompleted === true ||
			item.completed === true ||
			learningCompletedAt !== undefined;
		const practicePassed =
			item.practicePassed === true ||
			item.completed === true ||
			practicePassedAt !== undefined;

		if (practicePassed) {
			learningCompleted = true;
			learningCompletedAt ??= practicePassedAt;
		}

		let practiceAttempts = normalizeNonNegativeInteger(item.practiceAttempts) ?? 0;
		if (
			practiceAttempts === 0 &&
			(bestPracticeScore !== undefined || latestPracticeScore !== undefined || practicePassed)
		) {
			practiceAttempts = 1;
		}

		byLessonId.set(lessonId, {
			lessonId,
			learningCompleted,
			...(learningCompletedAt ? { learningCompletedAt } : {}),
			practiceAttempts,
			...(bestPracticeScore !== undefined ? { bestPracticeScore } : {}),
			...(latestPracticeScore !== undefined ? { latestPracticeScore } : {}),
			practicePassed,
			...(practicePassedAt ? { practicePassedAt } : {}),
		});
	}

	return Array.from(byLessonId.values()).sort((left, right) => left.lessonId - right.lessonId);
}

function hasLearningCompleted(entry: LessonProgress | undefined): boolean {
	return entry?.learningCompleted === true;
}

function hasPracticePassed(entry: LessonProgress | undefined): boolean {
	return entry?.practicePassed === true;
}

function collectKnownLetters(
	storedKnownLetters: string[],
	lessonProgress: LessonProgress[],
): string[] {
	const completedLessonIds = new Set(
		lessonProgress.filter(hasLearningCompleted).map((entry) => entry.lessonId),
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
		lessonProgress.filter(hasPracticePassed).map((entry) => entry.lessonId),
	);
	const storedWordSet = new Set(storedKnownWords.map((word) => word.thai));
	const normalized: Word[] = [];
	const normalizedWordSet = new Set<string>();

	for (const lesson of lessons) {
		const lessonWords = getCanonicalLessonWords(lesson.id);
		const shouldIncludeLessonWords =
			completedLessonIds.has(lesson.id) ||
			lessonWords.some((word) => storedWordSet.has(word.thai));

		if (!shouldIncludeLessonWords) {
			continue;
		}

		for (const word of lessonWords) {
			if (normalizedWordSet.has(word.thai)) continue;

			normalizedWordSet.add(word.thai);
			normalized.push(word);
		}
	}

	return normalized;
}

function getCurrentLessonIdFromProgress(lessonProgress: LessonProgress[]): number {
	const passedLessonIds = new Set(
		lessonProgress.filter(hasPracticePassed).map((entry) => entry.lessonId),
	);

	for (const lessonId of lessonIds) {
		if (!passedLessonIds.has(lessonId)) {
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

	if (value.version === 1 || value.version === 2) {
		return {
			version: value.version,
			progress: normalizeProgress(value.progress),
		};
	}

	return null;
}

function createSnapshot(progress: AppProgress): ProgressSnapshotV3 {
	return {
		version: STORAGE_VERSION,
		progress: normalizeProgress(progress),
	};
}

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

function saveProgress(progress: AppProgress) {
	if (typeof window === "undefined") return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(createSnapshot(progress)));
	} catch {
		// ignore storage errors
	}
}

function upsertLessonProgress(
	lessonProgress: LessonProgress[],
	nextEntry: LessonProgress,
): LessonProgress[] {
	return [
		...lessonProgress.filter((entry) => entry.lessonId !== nextEntry.lessonId),
		nextEntry,
	].sort((left, right) => left.lessonId - right.lessonId);
}

function getLessonProgressEntry(
	lessonProgress: LessonProgress[],
	lessonId: number,
): LessonProgress | undefined {
	return lessonProgress.find((entry) => entry.lessonId === lessonId);
}

function summarizeResumeTarget(progressSnapshot: AppProgress): ResumeTarget {
	for (const lessonId of lessonIds) {
		const entry = getLessonProgressEntry(progressSnapshot.lessonProgress, lessonId);
		if (hasPracticePassed(entry)) continue;

		if (hasLearningCompleted(entry)) {
			return {
				lessonId,
				phase: "practice",
				href: `/learn/${lessonId}/practice`,
			};
		}

		return {
			lessonId,
			phase: "learn",
			href: `/learn/${lessonId}`,
		};
	}

	return {
		lessonId: lessonIds.length > 0 ? lastLessonId : null,
		phase: "review",
		href: "/practice",
	};
}

function getPassedLessonCount(lessonProgress: LessonProgress[]): number {
	return lessonProgress.filter(hasPracticePassed).length;
}

export function getLessonJourneyState(
	progressSnapshot: AppProgress,
	lessonId: number,
): LessonJourneyState {
	const lessonIndex = lessonIds.indexOf(lessonId);
	const currentLessonId = getCurrentLessonIdFromProgress(progressSnapshot.lessonProgress);
	const entry = getLessonProgressEntry(progressSnapshot.lessonProgress, lessonId);
	const previousLessonId = lessonIndex > 0 ? lessonIds[lessonIndex - 1] : null;
	const previousEntry =
		previousLessonId === null
			? undefined
			: getLessonProgressEntry(progressSnapshot.lessonProgress, previousLessonId);
	const learningCompleted = hasLearningCompleted(entry);
	const practicePassed = hasPracticePassed(entry);

	return {
		lessonId,
		learnUnlocked: previousLessonId === null || hasPracticePassed(previousEntry),
		practiceUnlocked: learningCompleted,
		learningCompleted,
		practicePassed,
		practiceAttempts: entry?.practiceAttempts ?? 0,
		...(entry?.bestPracticeScore !== undefined
			? { bestPracticeScore: entry.bestPracticeScore }
			: {}),
		...(entry?.latestPracticeScore !== undefined
			? { latestPracticeScore: entry.latestPracticeScore }
			: {}),
		isCurrent: lessonId === currentLessonId,
		currentPhase:
			lessonId === currentLessonId && !practicePassed
				? learningCompleted
					? "practice"
					: "learn"
				: null,
	};
}

export function getPracticePassCorrectCount(totalItems: number): number {
	if (totalItems <= 0) return 0;
	return Math.min(totalItems, Math.max(1, Math.ceil((totalItems * PRACTICE_PASS_PERCENT) / 100)));
}

function clampScore(score: number): number {
	return Math.max(0, Math.min(100, Math.round(score)));
}

export const progress = writable<AppProgress>(createInitialProgress());

let hasInitializedProgress = false;
let persistProgressUnsubscribe: Unsubscriber | null = null;

function ensureProgressInitialized() {
	if (typeof window === "undefined") return;
	if (hasInitializedProgress) return;
	hasInitializedProgress = true;

	progress.set(loadProgress());
	persistProgressUnsubscribe ??= progress.subscribe(saveProgress);
}

ensureProgressInitialized();

export const knownLetters = derived(progress, ($p) => $p.knownLetters);
export const knownWords = derived(progress, ($p) => $p.knownWords);
export const currentLessonId = derived(progress, ($p) => $p.currentLessonId);
export const completedLessonCount = derived(progress, ($p) =>
	getPassedLessonCount($p.lessonProgress),
);
export const resumeTarget = derived(progress, ($p) => summarizeResumeTarget($p));
export const resumeHref = derived(resumeTarget, ($resumeTarget) => $resumeTarget.href);
export const totalLessons = lessons.length;

export function applyLearnerProjection(projection: LearnerProjection) {
	progress.update(($p) => {
		const byLessonId = new Map($p.lessonProgress.map((entry) => [entry.lessonId, entry]));

		for (const serverLesson of projection.lessons) {
			const existing = byLessonId.get(serverLesson.lessonId);
			const serverBestScore = normalizeScore(serverLesson.bestScore ?? undefined);
			const serverLatestScore = normalizeScore(serverLesson.latestScore ?? undefined);
			const serverAttemptCount = Math.max(
				serverLesson.attemptCount,
				existing?.practiceAttempts ?? 0,
			);
			const practicePassed =
				serverLesson.status === "completed" || existing?.practicePassed === true;
			const learningCompleted = existing?.learningCompleted === true || practicePassed;
			const practicePassedAt = serverLesson.firstCompletedAt ?? existing?.practicePassedAt;
			const learningCompletedAt =
				existing?.learningCompletedAt ?? practicePassedAt ?? undefined;
			const shouldTrustServerLatest =
				serverLesson.attemptCount >= (existing?.practiceAttempts ?? 0);

			byLessonId.set(serverLesson.lessonId, {
				lessonId: serverLesson.lessonId,
				learningCompleted,
				...(learningCompletedAt ? { learningCompletedAt } : {}),
				practiceAttempts: serverAttemptCount,
				...(serverBestScore !== undefined || existing?.bestPracticeScore !== undefined
					? {
							bestPracticeScore: Math.max(
								serverBestScore ?? 0,
								existing?.bestPracticeScore ?? 0,
							),
						}
					: {}),
				...(serverLatestScore !== undefined || existing?.latestPracticeScore !== undefined
					? {
							latestPracticeScore: shouldTrustServerLatest
								? (serverLatestScore ?? existing?.latestPracticeScore ?? 0)
								: (existing?.latestPracticeScore ?? serverLatestScore ?? 0),
						}
					: {}),
				practicePassed,
				...(practicePassedAt ? { practicePassedAt } : {}),
			});
		}

		const merged = normalizeProgress({
			...$p,
			lessonProgress: Array.from(byLessonId.values()),
		});

		return {
			...merged,
			currentLessonId: Math.max(
				merged.currentLessonId,
				projection.currentLessonId ?? merged.currentLessonId,
			),
		};
	});
}

export function completeLessonLearning(lessonId: number): LessonProgress | null {
	let completedEntry: LessonProgress | null = null;

	progress.update(($p) => {
		if (!lessonById.has(lessonId)) return $p;

		const existing = getLessonProgressEntry($p.lessonProgress, lessonId);
		const learningCompletedAt = existing?.learningCompletedAt ?? new Date().toISOString();
		const nextEntry: LessonProgress = {
			lessonId,
			learningCompleted: true,
			learningCompletedAt,
			practiceAttempts: existing?.practiceAttempts ?? 0,
			...(existing?.bestPracticeScore !== undefined
				? { bestPracticeScore: existing.bestPracticeScore }
				: {}),
			...(existing?.latestPracticeScore !== undefined
				? { latestPracticeScore: existing.latestPracticeScore }
				: {}),
			practicePassed: existing?.practicePassed ?? false,
			...(existing?.practicePassedAt ? { practicePassedAt: existing.practicePassedAt } : {}),
		};
		completedEntry = nextEntry;

		return normalizeProgress({
			...$p,
			lessonProgress: upsertLessonProgress($p.lessonProgress, nextEntry),
		});
	});

	return completedEntry;
}

export function recordLessonPracticeAttempt(
	lessonId: number,
	practiceScore: number,
): LessonPracticeAttemptResult | null {
	let result: LessonPracticeAttemptResult | null = null;

	progress.update(($p) => {
		if (!lessonById.has(lessonId)) return $p;

		const existing = getLessonProgressEntry($p.lessonProgress, lessonId);
		const completedAt = new Date().toISOString();
		const score = clampScore(practiceScore);
		const passedThisAttempt = score >= PRACTICE_PASS_PERCENT;
		const alreadyPassed = existing?.practicePassed === true;
		const nextEntry: LessonProgress = {
			lessonId,
			learningCompleted: true,
			learningCompletedAt: existing?.learningCompletedAt ?? completedAt,
			practiceAttempts: (existing?.practiceAttempts ?? 0) + 1,
			bestPracticeScore: Math.max(existing?.bestPracticeScore ?? 0, score),
			latestPracticeScore: score,
			practicePassed: alreadyPassed || passedThisAttempt,
			...(existing?.practicePassedAt || passedThisAttempt
				? { practicePassedAt: existing?.practicePassedAt ?? completedAt }
				: {}),
		};

		result = {
			completedAt,
			entry: nextEntry,
			practicePassed: nextEntry.practicePassed,
			shouldSync: alreadyPassed || passedThisAttempt,
		};

		return normalizeProgress({
			...$p,
			lessonProgress: upsertLessonProgress($p.lessonProgress, nextEntry),
		});
	});

	return result;
}
