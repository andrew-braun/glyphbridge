import { writable } from "svelte/store";

import { browser } from "$app/environment";
import type { AuthSessionSummary, LearnerProjectionEnvelope } from "$lib/data/learner";

import { applyLearnerProjection } from "./progress";
import { flushPendingLessonAttempts } from "./progress-sync";

type LearnerProjectionStatus = "idle" | "loading" | "loaded" | "error";

export const authSession = writable<AuthSessionSummary>({
	authenticated: false,
	email: null,
});

export const learnerProjection = writable<LearnerProjectionEnvelope["projection"]>(null);
export const learnerProjectionStatus = writable<LearnerProjectionStatus>("idle");

function applyEnvelope(envelope: LearnerProjectionEnvelope) {
	authSession.set(envelope.auth);
	learnerProjection.set(envelope.projection);

	if (envelope.projection) {
		applyLearnerProjection(envelope.projection);
	}
}

export async function refreshLearnerProjection(
	fetcher: typeof fetch = fetch,
): Promise<LearnerProjectionEnvelope | null> {
	if (!browser) return null;

	learnerProjectionStatus.set("loading");

	try {
		const response = await fetcher("/api/learner/projection", {
			headers: { accept: "application/json" },
		});

		if (!response.ok) {
			learnerProjectionStatus.set("error");
			return null;
		}

		const envelope = (await response.json()) as LearnerProjectionEnvelope;
		applyEnvelope(envelope);

		const flushedEnvelope = await flushPendingLessonAttempts(fetcher);
		if (flushedEnvelope) {
			applyEnvelope(flushedEnvelope);
		}

		learnerProjectionStatus.set("loaded");
		return flushedEnvelope ?? envelope;
	} catch {
		learnerProjectionStatus.set("error");
		return null;
	}
}
