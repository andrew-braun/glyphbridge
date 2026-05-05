import { json } from "@sveltejs/kit";

import type { LearnerProjectionEnvelope, LessonCompletionSyncInput } from "$lib/data/learner";
import { getSupabaseClient, requireVerifiedUser } from "$lib/server/auth";
import { getLearnerProjection, syncLessonCompletionAttempts } from "$lib/server/learner-projection";

import type { RequestHandler } from "./$types";

export const prerender = false;

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const clientAttemptIdPattern = /^[A-Za-z0-9:_-]{1,64}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isValidScore(value: unknown): value is number {
	return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 100;
}

function isValidCompletedAt(value: unknown): value is string {
	return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function readAttempts(value: unknown): LessonCompletionSyncInput[] | null {
	if (!isRecord(value) || !Array.isArray(value.attempts)) return null;
	if (value.attempts.length < 1 || value.attempts.length > 50) return null;

	const attempts: LessonCompletionSyncInput[] = [];
	const seenAttemptIds = new Set<string>();

	for (const item of value.attempts) {
		if (!isRecord(item)) return null;

		const clientAttemptId = item.clientAttemptId;
		const publicationId = item.publicationId;
		const lessonId = item.lessonId;
		const score = item.score;
		const completedAt = item.completedAt;
		const timeSpentMs = item.timeSpentMs;

		if (typeof clientAttemptId !== "string" || !clientAttemptIdPattern.test(clientAttemptId)) {
			return null;
		}

		if (seenAttemptIds.has(clientAttemptId)) return null;
		seenAttemptIds.add(clientAttemptId);

		if (typeof publicationId !== "string" || !uuidPattern.test(publicationId)) return null;
		if (typeof lessonId !== "number" || !Number.isInteger(lessonId) || lessonId < 1)
			return null;
		if (!isValidScore(score)) return null;
		if (!isValidCompletedAt(completedAt)) return null;

		if (
			timeSpentMs !== undefined &&
			(typeof timeSpentMs !== "number" ||
				!Number.isInteger(timeSpentMs) ||
				timeSpentMs < 0 ||
				timeSpentMs > 86_400_000)
		) {
			return null;
		}

		attempts.push({
			clientAttemptId,
			publicationId,
			lessonId,
			score,
			completedAt,
			...(timeSpentMs !== undefined ? { timeSpentMs } : {}),
		});
	}

	return attempts;
}

function projectionJson(envelope: LearnerProjectionEnvelope): Response {
	return json(envelope, {
		headers: {
			"cache-control": "no-store",
		},
	});
}

export const POST: RequestHandler = async ({ locals, request }) => {
	const user = await requireVerifiedUser(locals);
	const supabase = getSupabaseClient(locals);

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const attempts = readAttempts(body);

	if (!attempts) {
		return json({ error: "Invalid lesson sync payload" }, { status: 400 });
	}

	await syncLessonCompletionAttempts(supabase, attempts);
	const projection = await getLearnerProjection(supabase);

	return projectionJson({
		auth: { authenticated: true, email: user.email ?? null },
		projection,
	});
};
