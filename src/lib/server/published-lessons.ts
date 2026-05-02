import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { error } from "@sveltejs/kit";

import type { Lesson } from "$lib/data/types";
import {
	GENERATED_PUBLICATION_MANIFEST_FILE,
	getPublicationCacheKey,
} from "$lib/utils/publication";

import type { PublishedLessonCard } from "./delivery-lessons";

export type PublishedLessonVersion = {
	publicationId: string;
	publicationCacheKey: string;
	generatedAt: string;
};

type LessonPublicationArtifact = PublishedLessonVersion & {
	lessons: Lesson[];
};

type LessonPublicationManifest = PublishedLessonVersion & {
	artifactPath: string;
};

const GENERATED_DIR = resolve(process.cwd(), ".generated");
const ARTIFACT_MANIFEST_PATH = resolve(GENERATED_DIR, GENERATED_PUBLICATION_MANIFEST_FILE);

function toLessonCard(lesson: Lesson): PublishedLessonCard {
	return {
		id: lesson.id,
		stage: lesson.stage,
		title: lesson.title,
		anchorWord: lesson.anchorWord,
		newLetters: lesson.newLetters,
	};
}

function readArtifactManifest(): LessonPublicationManifest | null {
	if (!existsSync(ARTIFACT_MANIFEST_PATH)) {
		return null;
	}

	try {
		return JSON.parse(
			readFileSync(ARTIFACT_MANIFEST_PATH, "utf8"),
		) as LessonPublicationManifest;
	} catch {
		throw error(
			500,
			`Unable to read generated lesson publication manifest at ${ARTIFACT_MANIFEST_PATH}`,
		);
	}
}

function readArtifact(manifest: LessonPublicationManifest): LessonPublicationArtifact {
	const artifactPath = resolve(GENERATED_DIR, manifest.artifactPath);
	if (!existsSync(artifactPath)) {
		throw error(500, `Generated lesson publication artifact is missing at ${artifactPath}`);
	}

	try {
		const artifact = JSON.parse(
			readFileSync(artifactPath, "utf8"),
		) as LessonPublicationArtifact;

		if (
			artifact.publicationId !== manifest.publicationId ||
			artifact.publicationCacheKey !== manifest.publicationCacheKey
		) {
			throw error(500, "Generated lesson publication artifact does not match its manifest");
		}

		return artifact;
	} catch (artifactError) {
		if (artifactError instanceof Error && "status" in artifactError) {
			throw artifactError;
		}

		throw error(500, `Unable to read generated lesson publication artifact at ${artifactPath}`);
	}
}

async function getPublicationArtifact(): Promise<LessonPublicationArtifact | null> {
	const manifest = readArtifactManifest();
	if (!manifest) {
		return null;
	}

	return readArtifact(manifest);
}

export async function getPublishedLessonVersion(): Promise<PublishedLessonVersion> {
	const artifact = await getPublicationArtifact();
	if (artifact) {
		return {
			publicationId: artifact.publicationId,
			publicationCacheKey: artifact.publicationCacheKey,
			generatedAt: artifact.generatedAt,
		};
	}

	const deliveryLessons = await import("./delivery-lessons");
	const publicationId = await deliveryLessons.getPublishedLessonPublicationId();

	return {
		publicationId,
		publicationCacheKey: getPublicationCacheKey(publicationId),
		generatedAt: new Date(0).toISOString(),
	};
}

export async function getPublishedLessonCards(): Promise<PublishedLessonCard[]> {
	const artifact = await getPublicationArtifact();
	if (artifact) {
		return artifact.lessons.map((lesson) => toLessonCard(lesson));
	}

	const deliveryLessons = await import("./delivery-lessons");
	return deliveryLessons.getPublishedLessonCards();
}

export async function getPublishedLesson(
	lessonId: number,
): Promise<{ lesson: Lesson; nextLessonId: number | null }> {
	const artifact = await getPublicationArtifact();
	if (artifact) {
		const currentLessonIndex = artifact.lessons.findIndex((lesson) => lesson.id === lessonId);
		if (currentLessonIndex < 0) {
			throw error(404, "Lesson not found");
		}

		return {
			lesson: artifact.lessons[currentLessonIndex],
			nextLessonId: artifact.lessons[currentLessonIndex + 1]?.id ?? null,
		};
	}

	const deliveryLessons = await import("./delivery-lessons");
	return deliveryLessons.getPublishedLesson(lessonId);
}

export async function getPublishedLessonEntries(): Promise<Array<{ id: string }>> {
	const artifact = await getPublicationArtifact();
	if (artifact) {
		return artifact.lessons.map((lesson) => ({ id: String(lesson.id) }));
	}

	const cards = await getPublishedLessonCards();
	return cards.map((lesson) => ({ id: String(lesson.id) }));
}
