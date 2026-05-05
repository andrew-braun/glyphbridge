import { browser } from "$app/environment";
import type { LearnerProjectionEnvelope, LessonCompletionSyncInput } from "$lib/data/learner";

import { applyLearnerProjection } from "./progress";

const STORAGE_KEY = "glyphbridge_pending_lesson_attempts";
const MAX_PENDING_ATTEMPTS = 200;

type PendingAttemptSnapshot = {
	version: 1;
	attempts: LessonCompletionSyncInput[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isPendingAttempt(value: unknown): value is LessonCompletionSyncInput {
	return (
		isRecord(value) &&
		typeof value.clientAttemptId === "string" &&
		typeof value.publicationId === "string" &&
		typeof value.lessonId === "number" &&
		typeof value.score === "number" &&
		typeof value.completedAt === "string"
	);
}

function loadPendingAttempts(): LessonCompletionSyncInput[] {
	if (!browser) return [];

	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];

		const snapshot = JSON.parse(raw) as unknown;
		if (!isRecord(snapshot) || snapshot.version !== 1 || !Array.isArray(snapshot.attempts)) {
			return [];
		}

		return snapshot.attempts.filter(isPendingAttempt).slice(-MAX_PENDING_ATTEMPTS);
	} catch {
		return [];
	}
}

function savePendingAttempts(attempts: LessonCompletionSyncInput[]) {
	if (!browser) return;

	const snapshot: PendingAttemptSnapshot = {
		version: 1,
		attempts: attempts.slice(-MAX_PENDING_ATTEMPTS),
	};

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
	} catch {
		// ignore storage failures
	}
}

function createAttemptId(lessonId: number): string {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return `lesson_${lessonId}_${crypto.randomUUID()}`;
	}

	const random = Math.random().toString(36).slice(2, 14);
	return `lesson_${lessonId}_${Date.now().toString(36)}_${random}`.slice(0, 64);
}

export function createLessonCompletionSyncInput({
	completedAt,
	lessonId,
	publicationId,
	score,
}: {
	completedAt: string;
	lessonId: number;
	publicationId: string;
	score: number;
}): LessonCompletionSyncInput {
	return {
		clientAttemptId: createAttemptId(lessonId),
		completedAt,
		lessonId,
		publicationId,
		score: Math.max(0, Math.min(100, Math.round(score))),
	};
}

export function queueLessonCompletionAttempt(attempt: LessonCompletionSyncInput) {
	const attempts = loadPendingAttempts();

	if (attempts.some((pending) => pending.clientAttemptId === attempt.clientAttemptId)) return;

	savePendingAttempts([...attempts, attempt]);
}

export async function flushPendingLessonAttempts(
	fetcher: typeof fetch = fetch,
): Promise<LearnerProjectionEnvelope | null> {
	if (!browser) return null;

	const attempts = loadPendingAttempts();
	if (attempts.length === 0) return null;

	try {
		const response = await fetcher("/api/learner/sync", {
			body: JSON.stringify({ attempts }),
			headers: {
				accept: "application/json",
				"content-type": "application/json",
			},
			method: "POST",
		});

		if (response.status === 401 || response.status === 503) return null;

		if (response.status === 400) {
			savePendingAttempts([]);
			return null;
		}

		if (!response.ok) return null;

		const envelope = (await response.json()) as LearnerProjectionEnvelope;
		savePendingAttempts([]);

		if (envelope.projection) {
			applyLearnerProjection(envelope.projection);
		}

		return envelope;
	} catch {
		return null;
	}
}

export async function queueAndFlushLessonCompletionAttempt(
	attempt: LessonCompletionSyncInput,
	fetcher: typeof fetch = fetch,
): Promise<LearnerProjectionEnvelope | null> {
	queueLessonCompletionAttempt(attempt);
	return flushPendingLessonAttempts(fetcher);
}
