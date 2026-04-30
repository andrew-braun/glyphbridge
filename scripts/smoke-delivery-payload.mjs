import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@supabase/supabase-js";

import { thaiPack } from "../src/lib/data/thai.ts";
import { mapPublishedLessonPayload } from "../src/lib/server/delivery-payload.ts";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");

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

function normalizeForComparison(value) {
	return JSON.parse(JSON.stringify(value));
}

const dotEnv = parseDotEnvFile(resolve(repoRoot, ".env"));
const supabaseUrl = getEnvValue(dotEnv, ["PUBLIC_SUPABASE_URL", "API_URL"]);
const supabaseAnonKey = getEnvValue(dotEnv, ["PUBLIC_SUPABASE_ANON_KEY", "PUBLISHABLE_KEY"]);

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		"Missing PUBLIC_SUPABASE_URL/PUBLIC_SUPABASE_ANON_KEY for the delivery smoke test. For local Supabase, run `pnpm exec supabase status -o env` and map API_URL/PUBLISHABLE_KEY into those variables or into .env.",
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
	throw new Error(`Unable to load the active lesson publication: ${publicationError.message}`);
}

assert.ok(publications?.length, "No active lesson publication is available");
assert.equal(
	publications.length,
	1,
	"Expected exactly one active lesson publication for the delivery smoke test",
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

assert.ok(lessonRows, "Expected published lessons for the active publication");
assert.equal(
	lessonRows.length,
	thaiPack.lessons.length,
	`Expected ${thaiPack.lessons.length} published lessons, received ${lessonRows.length}`,
);

for (const [index, row] of lessonRows.entries()) {
	const runtimeLesson = thaiPack.lessons[index];
	assert.ok(runtimeLesson, `Unexpected published lesson at index ${index}`);
	assert.equal(
		row.lesson_ordinal,
		runtimeLesson.id,
		`Published lesson ordinal mismatch at index ${index}`,
	);

	const publishedLesson = normalizeForComparison(mapPublishedLessonPayload(row.payload));
	const expectedLesson = normalizeForComparison(runtimeLesson);
	assert.deepStrictEqual(
		publishedLesson,
		expectedLesson,
		`Published lesson ${runtimeLesson.id} diverged from the runtime lesson contract`,
	);
}

console.log(
	`Delivery payload smoke passed for ${lessonRows.length} lessons in active publication ${publicationId}.`,
);
