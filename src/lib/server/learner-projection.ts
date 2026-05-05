import type { SupabaseClient } from "@supabase/supabase-js";
import { error } from "@sveltejs/kit";

import type {
	LearnerLessonProjection,
	LearnerLessonStatus,
	LearnerProjection,
	LessonCompletionSyncInput,
} from "$lib/data/learner";

type ActivePublicationRow = {
	id: string;
	course_version_id: string;
};

type ProjectionRow = {
	enrollment_id: string;
	publication_id: string;
	course_version_id: string;
	current_lesson_id: string | null;
	current_lesson_slug: string | null;
	lesson_id: string;
	lesson_slug: string;
	lesson_ordinal: number;
	status: string;
	best_score: number | null;
	latest_score: number | null;
	attempt_count: number;
	first_completed_at: string | null;
	last_attempt_at: string | null;
};

type SyncAttemptRow = {
	client_attempt_id: string;
	lesson_id: string;
	completed: boolean;
	score: number;
	time_spent_ms: number | null;
	attempt_payload: Record<string, unknown>;
	completed_at: string;
};

const allowedStatuses = new Set<string>(["not_started", "in_progress", "completed"]);

function normalizeStatus(status: string): LearnerLessonStatus {
	return allowedStatuses.has(status) ? (status as LearnerLessonStatus) : "not_started";
}

async function getActivePublication(client: SupabaseClient): Promise<ActivePublicationRow> {
	const delivery = client.schema("delivery");
	const { data, error: selectError } = await delivery
		.from("course_publications")
		.select("id, course_version_id")
		.eq("is_active", true)
		.order("created_at", { ascending: false })
		.limit(2)
		.returns<ActivePublicationRow[]>();

	if (selectError) {
		throw error(500, "Unable to load the active lesson publication");
	}

	if (!data || data.length === 0) {
		throw error(503, "No active lesson publication is available");
	}

	if (data.length > 1) {
		throw error(500, "Exactly one active lesson publication is required");
	}

	return data[0];
}

async function getProjectionRows(
	client: SupabaseClient,
	publicationId: string,
): Promise<ProjectionRow[]> {
	const learner = client.schema("learner");
	const { data, error: rpcError } = await learner.rpc("get_lesson_progress_projection", {
		p_publication_id: publicationId,
	});

	if (rpcError) {
		throw error(500, "Unable to load learner progress");
	}

	return Array.isArray(data) ? (data as ProjectionRow[]) : [];
}

function mapProjectionRows(rows: ProjectionRow[], publicationId: string): LearnerProjection {
	const firstRow = rows[0];

	if (!firstRow) {
		throw error(503, "The active lesson publication has no lessons");
	}

	const lessonIdByUuid = new Map(rows.map((row) => [row.lesson_id, row.lesson_ordinal]));
	const currentLessonId = firstRow.current_lesson_id
		? (lessonIdByUuid.get(firstRow.current_lesson_id) ?? null)
		: null;

	const lessons: LearnerLessonProjection[] = rows.map((row) => ({
		lessonId: row.lesson_ordinal,
		lessonSlug: row.lesson_slug,
		status: normalizeStatus(row.status),
		bestScore: row.best_score,
		latestScore: row.latest_score,
		attemptCount: row.attempt_count,
		firstCompletedAt: row.first_completed_at,
		lastAttemptAt: row.last_attempt_at,
	}));

	const completedLessonIds = lessons
		.filter((lesson) => lesson.status === "completed")
		.map((lesson) => lesson.lessonId);
	const firstIncompleteLesson = lessons.find((lesson) => lesson.status !== "completed");
	const resumeLessonId =
		currentLessonId ?? firstIncompleteLesson?.lessonId ?? lessons.at(-1)?.lessonId ?? null;

	return {
		publicationId,
		courseVersionId: firstRow.course_version_id,
		enrollmentId: firstRow.enrollment_id,
		currentLessonId,
		resumeLessonId,
		completedLessonIds,
		lessons,
		syncedAt: new Date().toISOString(),
	};
}

export async function getLearnerProjection(client: SupabaseClient): Promise<LearnerProjection> {
	const publication = await getActivePublication(client);
	const rows = await getProjectionRows(client, publication.id);

	return mapProjectionRows(rows, publication.id);
}

export async function syncLessonCompletionAttempts(
	client: SupabaseClient,
	attempts: LessonCompletionSyncInput[],
): Promise<void> {
	const attemptsByPublication = new Map<string, LessonCompletionSyncInput[]>();

	for (const attempt of attempts) {
		const publicationAttempts = attemptsByPublication.get(attempt.publicationId) ?? [];
		publicationAttempts.push(attempt);
		attemptsByPublication.set(attempt.publicationId, publicationAttempts);
	}

	for (const [publicationId, publicationAttempts] of attemptsByPublication) {
		const rows = await getProjectionRows(client, publicationId);
		const firstRow = rows[0];

		if (!firstRow) {
			throw error(503, "The selected lesson publication has no lessons");
		}

		const lessonUuidByOrdinal = new Map(rows.map((row) => [row.lesson_ordinal, row.lesson_id]));
		const rpcAttempts: SyncAttemptRow[] = publicationAttempts.map((attempt) => {
			const lessonUuid = lessonUuidByOrdinal.get(attempt.lessonId);

			if (!lessonUuid) {
				throw error(400, "A synced lesson does not belong to the selected publication");
			}

			return {
				client_attempt_id: attempt.clientAttemptId,
				lesson_id: lessonUuid,
				completed: true,
				score: attempt.score,
				time_spent_ms: attempt.timeSpentMs ?? null,
				attempt_payload: {
					publicationId,
					lessonOrdinal: attempt.lessonId,
					source: "glyphbridge-lesson-completion",
				},
				completed_at: attempt.completedAt,
			};
		});

		const learner = client.schema("learner");
		const { error: rpcError } = await learner.rpc(
			"sync_lesson_attempt_batch_for_current_user",
			{
				p_attempts: rpcAttempts,
				p_device_id: null,
				p_enrollment_id: firstRow.enrollment_id,
			},
		);

		if (rpcError) {
			throw error(400, "Unable to sync lesson progress");
		}
	}
}
