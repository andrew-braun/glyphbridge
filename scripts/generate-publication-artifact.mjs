import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@supabase/supabase-js";

import { mapPublishedLessonPayload } from "../src/lib/server/delivery-payload.ts";
import {
	GENERATED_PUBLICATION_MANIFEST_FILE,
	getPublicationArtifactFileName,
	getPublicationCacheKey,
} from "../src/lib/utils/publication.ts";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const outputDir = resolve(repoRoot, ".generated");
const legacyArtifactFile = resolve(outputDir, "published-lessons.json");
const manifestFile = resolve(outputDir, GENERATED_PUBLICATION_MANIFEST_FILE);

function parseDotEnvFile(filePath) {
	if (!existsSync(filePath)) {
		return {};
	}

	const fileText = readFileSync(filePath, "utf8");
	const entries = {};

	for (const rawLine of fileText.split(/\r?\n/u)) {
		const line = rawLine.trim();
		if (!line || line.startsWith("#")) continue;

		const equalsIndex = line.indexOf("=");
		if (equalsIndex < 0) continue;

		const key = line.slice(0, equalsIndex).trim();
		let value = line.slice(equalsIndex + 1).trim();

		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}

		entries[key] = value;
	}

	return entries;
}

function getEnvValue(dotEnv, keys) {
	for (const key of keys) {
		const value = process.env[key] ?? dotEnv[key];
		if (value) return value;
	}

	return "";
}

async function loadDeliveryArtifact() {
	const dotEnv = parseDotEnvFile(resolve(repoRoot, ".env"));
	const supabaseUrl = getEnvValue(dotEnv, [
		"SUPABASE_DELIVERY_URL",
		"PUBLIC_SUPABASE_URL",
		"API_URL",
	]);
	const supabaseAnonKey = getEnvValue(dotEnv, [
		"SUPABASE_DELIVERY_ANON_KEY",
		"PUBLIC_SUPABASE_ANON_KEY",
		"PUBLISHABLE_KEY",
	]);

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error(
			"Missing delivery read credentials for publication export. Set SUPABASE_DELIVERY_URL/SUPABASE_DELIVERY_ANON_KEY or map your local Supabase API_URL/PUBLISHABLE_KEY into .env before building.",
		);
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
	const delivery = supabase.schema("delivery");

	const { data: publications, error: publicationError } = await delivery
		.from("course_publications")
		.select("id")
		.eq("is_active", true)
		.order("created_at", { ascending: false })
		.limit(2);

	if (publicationError) {
		throw new Error(
			`Unable to load the active lesson publication: ${publicationError.message}`,
		);
	}

	assert.ok(publications?.length, "No active lesson publication is available");
	assert.equal(
		publications.length,
		1,
		"Expected exactly one active lesson publication for publication export",
	);

	const publicationId = publications[0].id;
	const { data: lessonRows, error: lessonError } = await delivery
		.from("course_publication_lessons")
		.select("lesson_ordinal, payload")
		.eq("publication_id", publicationId)
		.order("lesson_ordinal", { ascending: true });

	if (lessonError) {
		throw new Error(`Unable to load published lessons: ${lessonError.message}`);
	}

	assert.ok(lessonRows?.length, "Expected published lessons for the active publication");

	return {
		publicationId,
		lessons: lessonRows.map((row) => {
			const lesson = mapPublishedLessonPayload(row.payload);
			assert.equal(
				lesson.id,
				row.lesson_ordinal,
				`Published lesson ordinal mismatch for lesson ${row.lesson_ordinal}`,
			);

			return lesson;
		}),
	};
}

const publicationArtifact = await loadDeliveryArtifact();
const generatedAt = new Date().toISOString();
const artifactPath = getPublicationArtifactFileName(publicationArtifact.publicationId);
const artifactFile = resolve(outputDir, artifactPath);
const publicationCacheKey = getPublicationCacheKey(publicationArtifact.publicationId);

mkdirSync(outputDir, { recursive: true });
rmSync(legacyArtifactFile, { force: true });
writeFileSync(
	artifactFile,
	`${JSON.stringify(
		{
			publicationId: publicationArtifact.publicationId,
			publicationCacheKey,
			generatedAt,
			lessons: publicationArtifact.lessons,
		},
		null,
		2,
	)}\n`,
	"utf8",
);

writeFileSync(
	manifestFile,
	`${JSON.stringify(
		{
			publicationId: publicationArtifact.publicationId,
			publicationCacheKey,
			generatedAt,
			artifactPath,
		},
		null,
		2,
	)}\n`,
	"utf8",
);

console.log(
	`Generated ${publicationArtifact.lessons.length} published lessons for active publication ${publicationArtifact.publicationId} at ${artifactFile} and wrote manifest ${manifestFile}.`,
);
