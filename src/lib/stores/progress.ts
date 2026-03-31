import { writable, derived, get } from 'svelte/store';
import type { AppProgress, Word, LessonProgress } from '$lib/data/types';
import { thaiPack } from '$lib/data/thai';

const STORAGE_KEY = 'sparkscripts_progress';

function createInitialProgress(): AppProgress {
	return {
		knownLetters: [],
		knownWords: [],
		lessonProgress: [],
		currentLessonId: 1
	};
}

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

function saveProgress(progress: AppProgress) {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
	} catch {
		// ignore storage errors
	}
}

export const progress = writable<AppProgress>(createInitialProgress());

export function initProgress() {
	const loaded = loadProgress();
	progress.set(loaded);
	progress.subscribe(saveProgress);
}

export const knownLetters = derived(progress, ($p) => $p.knownLetters);
export const knownWords = derived(progress, ($p) => $p.knownWords);
export const currentLessonId = derived(progress, ($p) => $p.currentLessonId);

export const currentLesson = derived(progress, ($p) => {
	return thaiPack.lessons.find((l) => l.id === $p.currentLessonId) ?? thaiPack.lessons[0];
});

export const totalLessons = thaiPack.lessons.length;

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

export function isLessonCompleted(lessonId: number): boolean {
	const $p = get(progress);
	return $p.lessonProgress.some((lp) => lp.lessonId === lessonId && lp.completed);
}

export function isLessonUnlocked(lessonId: number): boolean {
	const $p = get(progress);
	if (lessonId === 1) return true;
	return $p.lessonProgress.some((lp) => lp.lessonId === lessonId - 1 && lp.completed);
}

export function resetProgress() {
	progress.set(createInitialProgress());
}
