#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const defaultRepoRoot = resolve(scriptDir, "..");

const sourceUses = new Set(["discovery_only", "scoring_only", "scoring", "shipped_content"]);
const allowedDirections = new Set(["ltr", "rtl", "ttb", "mixed", "unknown"]);
const allowedUnicodeForms = new Set(["NFC", "NFD", "NFKC", "NFKD", "none"]);

const anchorWeights = {
	weighted_word_frequency: 0.22,
	real_world_utility: 0.18,
	coverage_gain: 0.16,
	decodability: 0.14,
	rule_payoff: 0.1,
	pronunciation_clarity: 0.08,
	review_value: 0.06,
	memorability: 0.04,
	source_confidence: 0.02,
};

const anchorPenaltyKeys = [
	"new_load_penalty",
	"irregularity_penalty",
	"ambiguity_penalty",
	"sensitivity_penalty",
	"license_penalty",
];

const graphemeWeights = {
	corpus_frequency: 0.3,
	distinct_word_coverage: 0.2,
	domain_coverage_gain: 0.15,
	anchor_availability: 0.1,
	pronunciation_clarity: 0.1,
	rule_gateway_value: 0.1,
	visual_distinctiveness: 0.05,
};

const graphemePenaltyKeys = [
	"confusability_penalty",
	"load_penalty",
	"irregularity_penalty",
	"font_penalty",
	"license_penalty",
];

function usage() {
	return [
		"Usage:",
		'  pnpm curriculum:scaffold <course-id> --name "Course Name" --language-tag <tag> --script <script-code> [--tracker <path|none>]',
		"  pnpm curriculum:validate <path-to-manifest.json>",
		"  pnpm curriculum:score <path-to-candidates.csv> [--out <path>]",
		"  pnpm curriculum:review <path-to-course-workspace> [--out <path>]",
		"",
		"Common options:",
		"  --root <path>   Resolve generated paths from a different repo root.",
		"  --force         Allow scaffold/review commands to overwrite generated files.",
		'  --tracker       Use a custom scaffold tracker path, or "none" to skip it.',
		"",
	].join("\n");
}

function parseArgs(rawArgs) {
	const positional = [];
	const flags = {};

	for (let index = 0; index < rawArgs.length; index += 1) {
		const arg = rawArgs[index];

		if (!arg.startsWith("--")) {
			positional.push(arg);
			continue;
		}

		const key = arg.slice(2);
		const next = rawArgs[index + 1];

		if (!next || next.startsWith("--")) {
			flags[key] = true;
			continue;
		}

		flags[key] = next;
		index += 1;
	}

	return { positional, flags };
}

function repoPath(root, path) {
	return resolve(root, path);
}

function ensureDir(path) {
	mkdirSync(path, { recursive: true });
}

function writeFile(path, content, { force = false } = {}) {
	if (existsSync(path) && !force) {
		console.log(`Skipped existing ${path}`);
		return;
	}

	ensureDir(dirname(path));
	writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
	console.log(`Wrote ${path}`);
}

function readJson(path) {
	return JSON.parse(readFileSync(path, "utf8"));
}

function toKebabCase(value) {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/gu, "-")
		.replace(/^-|-$/gu, "");
}

function csvEscape(value) {
	const text = String(value ?? "");
	if (!/[",\n\r]/u.test(text)) return text;
	return `"${text.replace(/"/gu, '""')}"`;
}

function parseCsvRows(text) {
	const rows = [];
	let row = [];
	let cell = "";
	let inQuotes = false;

	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];
		const next = text[index + 1];

		if (inQuotes) {
			if (char === '"' && next === '"') {
				cell += '"';
				index += 1;
			} else if (char === '"') {
				inQuotes = false;
			} else {
				cell += char;
			}

			continue;
		}

		if (char === '"') {
			inQuotes = true;
		} else if (char === ",") {
			row.push(cell);
			cell = "";
		} else if (char === "\n") {
			row.push(cell);
			rows.push(row);
			row = [];
			cell = "";
		} else if (char !== "\r") {
			cell += char;
		}
	}

	if (cell || row.length) {
		row.push(cell);
		rows.push(row);
	}

	return rows;
}

function parseCsvWithMetadata(text) {
	const rows = parseCsvRows(text);

	const [headerRow, ...dataRows] = rows.filter((candidate) => {
		return candidate.some((cellValue) => cellValue.trim());
	});

	if (!headerRow) return { headers: [], rows: [] };

	const headers = headerRow.map((header) => header.trim());
	const parsedRows = dataRows.map((dataRow, rowIndex) => {
		const parsedRow = Object.fromEntries(
			headers.map((header, index) => [header, dataRow[index]?.trim() ?? ""]),
		);

		Object.defineProperty(parsedRow, "__rowNumber", {
			value: rowIndex + 2,
		});

		return parsedRow;
	});

	return { headers, rows: parsedRows };
}

function parseCsv(text) {
	return parseCsvWithMetadata(text).rows;
}

function stringifyCsv(rows) {
	if (!rows.length) return "";

	const headers = Array.from(
		rows.reduce((set, row) => {
			for (const key of Object.keys(row)) set.add(key);
			return set;
		}, new Set()),
	);

	return [
		headers.map(csvEscape).join(","),
		...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
	].join("\n");
}

function numeric(row, key) {
	const rawValue = row[key];
	const candidateLabel = row.candidate ? ` for candidate "${row.candidate}"` : "";
	const rowLabel = row.__rowNumber ? `Row ${row.__rowNumber}${candidateLabel}` : "Row";

	if (rawValue === undefined) {
		throw new Error(`${rowLabel} is missing numeric column ${key}`);
	}

	if (rawValue === "") return 0;

	const value = Number(rawValue);
	if (!Number.isFinite(value)) {
		throw new Error(`${rowLabel} expected numeric value for ${key}, received "${rawValue}"`);
	}

	return value;
}

function scoringKeys(candidateType) {
	return candidateType === "grapheme"
		? [...Object.keys(graphemeWeights), ...graphemePenaltyKeys]
		: [...Object.keys(anchorWeights), ...anchorPenaltyKeys];
}

function validateCandidateCsv({ headers, rows, inputPath }) {
	if (!rows.length) {
		throw new Error(`No candidate rows found in ${inputPath}`);
	}

	const headerSet = new Set(headers);
	const candidateTypes = new Set(rows.map(inferCandidateType));

	for (const candidateType of candidateTypes) {
		const missing = scoringKeys(candidateType).filter((key) => !headerSet.has(key));
		if (missing.length) {
			throw new Error(
				`${inputPath} is missing required ${candidateType} scoring columns: ${missing.join(", ")}`,
			);
		}
	}

	const notesIndex = headers.indexOf("notes");
	if (notesIndex >= 0) {
		const penaltyKeys = [...anchorPenaltyKeys, ...graphemePenaltyKeys];
		const penaltyAfterNotes = penaltyKeys.filter((key) => {
			const penaltyIndex = headers.indexOf(key);
			return penaltyIndex > notesIndex;
		});

		if (penaltyAfterNotes.length) {
			throw new Error(
				`${inputPath} must place penalty columns before notes: ${penaltyAfterNotes.join(", ")}`,
			);
		}
	}

	for (const row of rows) {
		for (const key of scoringKeys(inferCandidateType(row))) {
			numeric(row, key);
		}
	}
}

function weightedSum(row, weights) {
	return Object.entries(weights).reduce((total, [key, weight]) => {
		return total + numeric(row, key) * weight;
	}, 0);
}

function penaltySum(row, keys) {
	return keys.reduce((total, key) => total + numeric(row, key), 0);
}

function inferCandidateType(row) {
	const declared = row.candidate_type?.toLowerCase();
	if (declared === "anchor" || declared === "grapheme") return declared;
	if ("weighted_word_frequency" in row) return "anchor";
	if ("corpus_frequency" in row) return "grapheme";
	return "anchor";
}

function scoreRow(row) {
	const candidateType = inferCandidateType(row);
	const rawScore =
		candidateType === "grapheme"
			? weightedSum(row, graphemeWeights) - penaltySum(row, graphemePenaltyKeys)
			: weightedSum(row, anchorWeights) - penaltySum(row, anchorPenaltyKeys);

	const score = Math.max(0, Math.min(1, rawScore));
	const scoreBand = score >= 0.75 ? "strong" : score >= 0.5 ? "promising" : "weak";

	return {
		...row,
		candidate_type: candidateType,
		candidate_score: score.toFixed(4),
		score_band: scoreBand,
	};
}

function validateManifest(manifest) {
	const errors = [];
	const warnings = [];

	for (const key of ["course_id", "display_name", "language_tag", "script", "direction"]) {
		if (!manifest[key] || typeof manifest[key] !== "string") {
			errors.push(`Missing string field: ${key}`);
		}
	}

	if (manifest.course_id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(manifest.course_id)) {
		errors.push("course_id must be lowercase kebab-case");
	}

	if (manifest.direction && !allowedDirections.has(manifest.direction)) {
		errors.push(`direction must be one of: ${Array.from(allowedDirections).join(", ")}`);
	}

	if (!Array.isArray(manifest.target_domains) || !manifest.target_domains.length) {
		errors.push("target_domains must include at least one domain");
	}

	if (!manifest.normalization || typeof manifest.normalization !== "object") {
		errors.push("normalization object is required");
	} else if (!allowedUnicodeForms.has(manifest.normalization.unicode_form)) {
		errors.push(
			`normalization.unicode_form must be one of: ${Array.from(allowedUnicodeForms).join(", ")}`,
		);
	}

	if (!manifest.segmentation || typeof manifest.segmentation !== "object") {
		errors.push("segmentation object is required");
	} else if (!manifest.segmentation.baseline) {
		errors.push("segmentation.baseline is required");
	}

	if (!Array.isArray(manifest.sources) || !manifest.sources.length) {
		errors.push("sources must include at least one source entry");
	} else {
		for (const [index, source] of manifest.sources.entries()) {
			const label = `sources[${index}]`;
			for (const key of ["id", "kind", "license", "use"]) {
				if (!source[key]) errors.push(`${label}.${key} is required`);
			}

			if (source.use && !sourceUses.has(source.use)) {
				errors.push(`${label}.use must be one of: ${Array.from(sourceUses).join(", ")}`);
			}

			if (
				typeof source.domain_weight !== "number" ||
				source.domain_weight < 0 ||
				source.domain_weight > 1
			) {
				errors.push(`${label}.domain_weight must be a number from 0 to 1`);
			}

			if (
				source.use === "shipped_content" &&
				/unknown|review|required/iu.test(source.license ?? "")
			) {
				errors.push(`${label} cannot use shipped_content without a reviewed license`);
			}

			if (source.license === "unknown") {
				warnings.push(
					`${label} has unknown license; keep it discovery_only or resolve before scoring`,
				);
			}
		}
	}

	if (!manifest.database?.strategy_file) {
		errors.push("database.strategy_file is required");
	}

	if (!manifest.review?.license_signoff_required) {
		warnings.push("review.license_signoff_required should usually be true");
	}

	return { errors, warnings };
}

function courseTrackerTemplate({ courseId, name, languageTag, script }) {
	return `# ${name} Curriculum

- Start date: YYYY-MM-DD
- Owner: TBD
- Status: planned

## Goal

Track curriculum authoring for ${name} (${languageTag}, ${script}).

## Source Files

- Bootstrap workspace: \`docs/curriculum/${courseId}/\`
- Manifest: \`docs/curriculum/${courseId}/manifest.json\`
- DB strategy: \`docs/curriculum/${courseId}/db-ingestion-strategy.md\`
- Durable course notes: \`docs/curriculum/${courseId}/${courseId}.md\`

## Current Status

- [ ] Course prospectus drafted
- [ ] Source manifest validated
- [ ] Script inventory drafted
- [ ] Candidate anchors scored
- [ ] Lesson sequence drafted
- [ ] Review packet generated
- [ ] DB ingestion strategy reviewed
- [ ] Lessons authored
- [ ] Publication path designed

## Open Questions

- Which target domains define v1?
- Which source licenses are cleared for shipped content versus scoring only?
- Who will review pronunciation, segmentation, and cultural context?
`;
}

function manifestTemplate({ courseId, name, languageTag, script }) {
	return JSON.stringify(
		{
			course_id: courseId,
			display_name: name,
			language_tag: languageTag,
			script,
			direction: "ltr",
			target_domains: ["menus", "public_signage"],
			normalization: {
				unicode_form: "NFC",
				preserve_original: true,
			},
			segmentation: {
				baseline: "unicode_uax_29",
				word_segmenter: "manual_review",
				notes: "Replace with a language-specific segmenter when needed.",
			},
			sources: [
				{
					id: "starter-source",
					kind: "frequency",
					url: "",
					license: "unknown",
					use: "discovery_only",
					domain_weight: 0.5,
					notes: "Replace with a reviewed source before scoring or shipping.",
				},
			],
			database: {
				strategy_file: "db-ingestion-strategy.md",
				target_schemas: ["curriculum", "delivery"],
				publication_required: true,
			},
			review: {
				native_speaker_required: true,
				pronunciation_required: true,
				license_signoff_required: true,
				cultural_review_required: true,
			},
		},
		undefined,
		2,
	);
}

function sourceCsvTemplate() {
	return `id,kind,url,license,use,domain_weight,notes
starter-source,frequency,,unknown,discovery_only,0.5,Replace before scoring or shipping`;
}

function graphemeCandidateTemplate() {
	return `candidate_type,candidate,gloss,corpus_frequency,distinct_word_coverage,domain_coverage_gain,anchor_availability,pronunciation_clarity,rule_gateway_value,visual_distinctiveness,confusability_penalty,load_penalty,irregularity_penalty,font_penalty,license_penalty,notes
grapheme,,,,,,,,,,,,,,,`;
}

function anchorCandidateTemplate() {
	return `candidate_type,candidate,gloss,weighted_word_frequency,real_world_utility,coverage_gain,decodability,rule_payoff,pronunciation_clarity,review_value,memorability,source_confidence,new_load_penalty,irregularity_penalty,ambiguity_penalty,sensitivity_penalty,license_penalty,notes
anchor,,,,,,,,,,,,,,,,,`;
}

function courseDocTemplate({ name }) {
	return `# ${name} Curriculum Notes

This durable course note should stay useful after the authoring task is complete.

## Course Boundary

- Language/script:
- Target learner:
- Target domains:
- Out of scope for v1:

## Sequencing Rationale

- Frequency sources:
- First-session decoding target:
- Stage coverage goals:

## Validation Notes

- Segmentation review:
- Pronunciation review:
- Cultural review:
- License review:
`;
}

function lessonSequenceTemplate({ courseId, name }) {
	return `# ${name} Lesson Sequence

This is the staged implementation outline for \`${courseId}\`. It should be
updated after candidate scoring and reviewer feedback.

## Course Shape

- First-session reading win:
- Approximate lesson count:
- Structural family:
- Required app support beyond the current Thai runtime:

## Stage 1: First Decoding Wins

| Lesson | Anchor | New units | Rule or pattern | Review units | Drill focus |
| --- | --- | --- | --- | --- | --- |
| 1 | TBD | TBD | TBD | TBD | TBD |

## Stage 2: Core Coverage

| Lesson | Anchor | New units | Rule or pattern | Review units | Drill focus |
| --- | --- | --- | --- | --- | --- |
| TBD | TBD | TBD | TBD | TBD | TBD |

## Stage 3: Variants, Confusables, And Domain Text

| Lesson | Anchor | New units | Rule or pattern | Review units | Drill focus |
| --- | --- | --- | --- | --- | --- |
| TBD | TBD | TBD | TBD | TBD | TBD |

## Coverage Notes

- Target-domain samples:
- Known-grapheme or known-unit coverage goal:
- Known-word or known-anchor coverage goal:
- Deferred high-load material:
`;
}

function questionsTemplate({ courseId, name }) {
	return `# ${name} Questions

Use this file for unresolved decisions that research cannot safely settle during
the \`${courseId}\` bootstrap.

## Architecture

- None yet.

## Product And Pedagogy

- None yet.

## Sources, Licensing, And Attribution

- None yet.

## Reviewers And Validation

- None yet.

## App Expansion Recommendations

- None yet.
`;
}

function dbStrategyTemplate({ courseId, name }) {
	return `# ${name} DB Ingestion Strategy

This file plans how reviewed authoring artifacts for \`${courseId}\` should move
into the database. It is a starter strategy, not an executable migration or seed
script.

## Source Artifacts

- Manifest: \`manifest.json\`
- Sources: \`sources.csv\`
- Grapheme candidates: \`grapheme-candidates.csv\`
- Anchor candidates: \`anchor-candidates.csv\`
- Lesson sequence: \`lesson-sequence.md\`
- Review packet: \`review-packet.md\`
- Open questions: \`questions.md\`
- Future lesson data: TBD

## Target Database Boundary

- \`curriculum\` stores normalized authoring data and is not queried directly by
  learner routes.
- \`delivery\` stores immutable published lesson bundles for runtime reads and
  offline caching.
- \`learner\` is out of scope for curriculum ingestion except for future progress
  compatibility checks.
- \`internal_api\` may eventually own publication helper functions, but this
  starter strategy should not add privileged functions without separate review.

## Mapping Plan

| Authoring artifact | Database target |
| --- | --- |
| Manifest language metadata | \`curriculum.languages\` |
| Manifest script metadata | \`curriculum.script_systems\` |
| Course prospectus | \`curriculum.courses\` |
| Release plan | \`curriculum.course_versions\` |
| Reviewed grapheme inventory | \`curriculum.graphemes\`, \`curriculum.course_version_graphemes\` |
| Lesson sequence | \`curriculum.lessons\` |
| Anchor and practice targets | \`curriculum.vocabulary_items\`, \`curriculum.vocabulary_segments\`, \`curriculum.lesson_vocabulary\` |
| Featured lesson anchor | \`curriculum.anchor_targets\`, \`curriculum.anchor_segments\` |
| Reusable rules | \`curriculum.orthography_rules\`, \`curriculum.orthography_rule_examples\`, \`curriculum.lesson_rules\` |
| Drills and options | \`curriculum.drills\`, \`curriculum.drill_options\`, \`curriculum.lesson_drills\` |
| Published runtime payloads | \`delivery.course_publications\`, \`delivery.course_publication_lessons\` |

## Publication Strategy

- Generate stable IDs and content hashes from reviewed source data.
- Insert normalized \`curriculum.*\` rows first.
- Build lesson-level runtime payloads from normalized rows, not from ad hoc UI
  data.
- Insert one inactive \`delivery.course_publications\` manifest and all matching
  \`delivery.course_publication_lessons\` rows.
- Activate the publication only after smoke checks confirm payload shape and
  lesson ordering.

## Validation Checklist

- [ ] Manifest validates with \`pnpm curriculum:validate\`.
- [ ] Source licenses are marked as discovery-only, scoring-only, scoring, or
  shipped-content approved.
- [ ] Every new grapheme maps to one script system and one course-version
  pedagogy row.
- [ ] Every anchor word also exists as vocabulary with \`role_key = 'anchor'\`.
- [ ] Every lesson has exactly one featured anchor target.
- [ ] Every drill has exactly one correct option.
- [ ] Delivery payloads can be regenerated deterministically.
- [ ] Smoke tests compare the published payload against the runtime lesson
  contract before activation.

## Open Decisions

- Should this course use a TypeScript source module first, or go straight to a
  generated SQL seed/publication artifact?
- Which reviewed fields are allowed to become learner-visible copy?
- Which artifacts must remain analysis-only because of source licenses?
`;
}

function reviewPacketTemplate({ manifest, candidates }) {
	const topCandidates = candidates
		.slice()
		.sort(
			(left, right) => Number(right.candidate_score ?? 0) - Number(left.candidate_score ?? 0),
		)
		.slice(0, 20);

	const candidateRows = topCandidates.length
		? topCandidates
				.map((candidate) => {
					return `| ${candidate.candidate_type || "anchor"} | ${candidate.candidate || "TBD"} | ${candidate.gloss || ""} | ${candidate.candidate_score || "unscored"} | ${candidate.notes || ""} |`;
				})
				.join("\n")
		: "| TBD | TBD |  |  |  |";

	return `# ${manifest.display_name} Review Packet

Generated from \`${manifest.course_id}\` authoring artifacts.

## Review Gates

- [ ] Segmentation and grapheme mapping
- [ ] Pronunciation or romanization
- [ ] Cultural context and learner-facing wording
- [ ] License and attribution
- [ ] Database ingestion readiness

## Course Summary

- Course ID: \`${manifest.course_id}\`
- Language tag: \`${manifest.language_tag}\`
- Script: \`${manifest.script}\`
- Direction: \`${manifest.direction}\`
- Target domains: ${manifest.target_domains.join(", ")}

## Sources To Review

| Source | Kind | Use | License | Notes |
| --- | --- | --- | --- | --- |
${manifest.sources
	.map((source) => {
		return `| ${source.id} | ${source.kind} | ${source.use} | ${source.license} | ${source.notes ?? ""} |`;
	})
	.join("\n")}

## Candidate Highlights

| Type | Candidate | Gloss | Score | Notes |
| --- | --- | --- | --- | --- |
${candidateRows}

## Reviewer Notes

### Segmentation

-

### Pronunciation

-

### Cultural Context

-

### License And Attribution

-

### DB Ingestion

-
`;
}

function relatedTrackerNames(root, courseId) {
	const trackerDir = repoPath(root, ".ai/curriculum");
	if (!existsSync(trackerDir)) return [];

	const baseCourseId = courseId.replace(/-v\d+$/u, "");

	return readdirSync(trackerDir)
		.filter((fileName) => fileName.endsWith(".md"))
		.map((fileName) => fileName.replace(/\.md$/u, ""))
		.filter((trackerId) => trackerId !== courseId)
		.filter(
			(trackerId) => trackerId === baseCourseId || baseCourseId.startsWith(`${trackerId}-`),
		);
}

function commandScaffold(positional, flags) {
	const courseId = toKebabCase(positional[0] ?? "");
	if (!courseId) throw new Error("scaffold requires a course id");

	const root = resolve(String(flags.root ?? defaultRepoRoot));
	const name = String(flags.name ?? courseId.replace(/-/gu, " "));
	const languageTag = String(flags["language-tag"] ?? "und-Zzzz");
	const script = String(flags.script ?? "Zzzz");
	const force = Boolean(flags.force);
	const trackerFlag = flags.tracker;
	const trackerPath =
		trackerFlag === "none"
			? undefined
			: repoPath(root, String(trackerFlag ?? `.ai/curriculum/${courseId}.md`));
	const workspaceRelativePath = `docs/curriculum/${courseId}`;
	const workspacePath = repoPath(root, `docs/curriculum/${courseId}`);
	const relatedTrackers = relatedTrackerNames(root, courseId);

	if (relatedTrackers.length && !trackerFlag) {
		console.warn(
			`Warning: found related curriculum tracker(s): ${relatedTrackers.join(", ")}. Use --tracker <path> or --tracker none if one of these should be reused.`,
		);
	}

	if (trackerPath) {
		writeFile(trackerPath, courseTrackerTemplate({ courseId, name, languageTag, script }), {
			force,
		});
	} else {
		console.log("Skipped tracker creation because --tracker none was provided");
	}

	writeFile(
		resolve(workspacePath, "manifest.json"),
		manifestTemplate({ courseId, name, languageTag, script }),
		{
			force,
		},
	);
	writeFile(resolve(workspacePath, "sources.csv"), sourceCsvTemplate(), { force });
	writeFile(resolve(workspacePath, "grapheme-candidates.csv"), graphemeCandidateTemplate(), {
		force,
	});
	writeFile(resolve(workspacePath, "anchor-candidates.csv"), anchorCandidateTemplate(), {
		force,
	});
	writeFile(
		resolve(workspacePath, "lesson-sequence.md"),
		lessonSequenceTemplate({ courseId, name }),
		{
			force,
		},
	);
	writeFile(
		resolve(workspacePath, "review-packet.md"),
		`# ${name} Review Packet\n\nRun \`pnpm curriculum:review ${workspaceRelativePath}\` after scoring candidates.`,
		{ force },
	);
	writeFile(
		resolve(workspacePath, "db-ingestion-strategy.md"),
		dbStrategyTemplate({ courseId, name }),
		{
			force,
		},
	);
	writeFile(resolve(workspacePath, `${courseId}.md`), courseDocTemplate({ name }), { force });
	writeFile(resolve(workspacePath, "questions.md"), questionsTemplate({ courseId, name }), {
		force,
	});
}

function commandValidate(positional) {
	const manifestPath = positional[0];
	if (!manifestPath) throw new Error("validate requires a manifest path");

	const manifest = readJson(resolve(manifestPath));
	const { errors, warnings } = validateManifest(manifest);

	for (const warning of warnings) console.warn(`Warning: ${warning}`);

	if (errors.length) {
		for (const error of errors) console.error(`Error: ${error}`);
		process.exitCode = 1;
		return;
	}

	console.log(`Manifest ${manifest.course_id} is valid with ${warnings.length} warning(s).`);
}

function commandScore(positional, flags) {
	const inputPath = positional[0];
	if (!inputPath) throw new Error("score requires a candidate CSV path");

	const resolvedInputPath = resolve(inputPath);
	const { headers, rows } = parseCsvWithMetadata(readFileSync(resolvedInputPath, "utf8"));
	validateCandidateCsv({ headers, rows, inputPath: resolvedInputPath });
	const scoredRows = rows
		.map(scoreRow)
		.sort((left, right) => Number(right.candidate_score) - Number(left.candidate_score));

	const extension = extname(resolvedInputPath) || ".csv";
	const defaultOutputPath = resolvedInputPath.slice(0, -extension.length) + ".scored.csv";
	const outputPath = resolve(String(flags.out ?? defaultOutputPath));
	writeFile(outputPath, stringifyCsv(scoredRows), { force: true });
}

function commandReview(positional, flags) {
	const workspace = positional[0];
	if (!workspace) throw new Error("review requires a course workspace path");

	const workspacePath = resolve(workspace);
	const manifest = readJson(resolve(workspacePath, "manifest.json"));
	const scoredPath = resolve(workspacePath, "anchor-candidates.scored.csv");
	const rawPath = resolve(workspacePath, "anchor-candidates.csv");
	const candidates = existsSync(scoredPath)
		? parseCsv(readFileSync(scoredPath, "utf8"))
		: parseCsv(readFileSync(rawPath, "utf8"));
	const outputPath = resolve(String(flags.out ?? resolve(workspacePath, "review-packet.md")));

	writeFile(outputPath, reviewPacketTemplate({ manifest, candidates }), {
		force: Boolean(flags.force),
	});
}

async function main() {
	const [command, ...rawArgs] = process.argv.slice(2);
	const { positional, flags } = parseArgs(rawArgs);

	if (!command || command === "help" || command === "--help") {
		console.log(usage());
		return;
	}

	if (command === "scaffold") commandScaffold(positional, flags);
	else if (command === "validate") commandValidate(positional);
	else if (command === "score") commandScore(positional, flags);
	else if (command === "review") commandReview(positional, flags);
	else throw new Error(`Unknown command: ${command}\n\n${usage()}`);
}

main().catch((error) => {
	console.error(error.message);
	process.exitCode = 1;
});
