export type AuthSessionSummary = {
	authenticated: boolean;
	email: string | null;
};

export type LearnerLessonStatus = "not_started" | "in_progress" | "completed";

export type LearnerLessonProjection = {
	lessonId: number;
	lessonSlug: string;
	status: LearnerLessonStatus;
	bestScore: number | null;
	latestScore: number | null;
	attemptCount: number;
	firstCompletedAt: string | null;
	lastAttemptAt: string | null;
};

export type LearnerProjection = {
	publicationId: string;
	courseVersionId: string;
	enrollmentId: string;
	currentLessonId: number | null;
	resumeLessonId: number | null;
	completedLessonIds: number[];
	lessons: LearnerLessonProjection[];
	syncedAt: string;
};

export type LearnerProjectionEnvelope = {
	auth: AuthSessionSummary;
	projection: LearnerProjection | null;
};

export type LessonCompletionSyncInput = {
	clientAttemptId: string;
	publicationId: string;
	lessonId: number;
	score: number;
	completedAt: string;
	timeSpentMs?: number;
};
