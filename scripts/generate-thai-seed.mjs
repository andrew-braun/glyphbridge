import crypto from "node:crypto";

import { thaiPack } from "../src/lib/data/thai.ts";

const lessonSlugs = new Map([
	[1, "maak"],
	[2, "dii"],
	[3, "gin"],
	[4, "talat"],
	[5, "bin"],
	[6, "maae"],
	[7, "raan"],
	[8, "chut"],
	[9, "sip"],
	[10, "khao"],
	[11, "moo"],
	[12, "ahan"],
	[13, "phat"],
]);

const releaseTimestamp = "2026-04-30T00:00:00+00:00";
const scriptSystemNativeName = "อักษรไทย";

function stableUuid(seed) {
	const hash = crypto.createHash("sha256").update(seed).digest("hex");
	return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

function stableJson(value) {
	if (Array.isArray(value)) {
		return value.map(stableJson);
	}

	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.keys(value)
				.sort()
				.map((key) => [key, stableJson(value[key])]),
		);
	}

	return value;
}

function hashJson(value) {
	return crypto
		.createHash("sha256")
		.update(JSON.stringify(stableJson(value)))
		.digest("hex");
}

function sqlString(value) {
	if (value === null || value === undefined) return "null";
	return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJson(value) {
	return `${sqlString(JSON.stringify(value))}::jsonb`;
}

function sqlTextArray(values) {
	if (!values.length) return "array[]::text[]";
	return `array[${values.map(sqlString).join(", ")}]::text[]`;
}

function insertStatement(table, columns, rows) {
	const values = rows
		.map((row) => `  (${columns.map((column) => row[column]).join(", ")})`)
		.join(",\n");

	return `insert into ${table} (\n  ${columns.join(",\n  ")}\n)\nvalues\n${values};\n`;
}

function graphemeKey(character) {
	const codepoints = Array.from(character).map((char) => {
		return char.codePointAt(0).toString(16).padStart(4, "0");
	});

	return `u${codepoints.join("-u")}`;
}

function vocabularyKey(text) {
	const codepoints = Array.from(text).map((char) => {
		return char.codePointAt(0).toString(16).padStart(4, "0");
	});

	return `word-${codepoints.join("-")}`;
}

function buildSeedModel() {
	const courseSlug = thaiPack.id;
	const courseId = stableUuid(`course:${courseSlug}`);
	const scriptSystemId = stableUuid(`script-system:${courseSlug}`);
	const courseVersionId = stableUuid(`course-version:${courseSlug}:1`);
	const publicationId = stableUuid(`publication:${courseSlug}:1`);

	const graphemeByCharacter = new Map();
	const rulesById = new Map();

	for (const lesson of thaiPack.lessons) {
		for (const letter of lesson.newLetters) {
			if (graphemeByCharacter.has(letter.character)) continue;

			graphemeByCharacter.set(letter.character, {
				id: stableUuid(`grapheme:${letter.character}`),
				key: graphemeKey(letter.character),
				text: letter.character,
				kind: letter.type,
				sortOrder: graphemeByCharacter.size + 1,
				unicodeCodepoints: Array.from(letter.character).map((char) => {
					return `U+${char.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`;
				}),
				metadata: {},
				romanization: letter.romanization,
				pronunciationHint: letter.pronunciation,
				mnemonic: letter.mnemonic,
				position: letter.position ?? null,
				details: letter.class ? { class: letter.class } : {},
				tags: [],
			});
		}

		for (const rule of lesson.rulesIntroduced) {
			if (rulesById.has(rule.id)) continue;

			rulesById.set(rule.id, {
				id: stableUuid(`rule:${rule.id}`),
				key: rule.id,
				name: rule.name,
				shortDescription: rule.shortDescription,
				explanation: rule.explanation,
				metadata: {},
				examples: rule.examples.map((text, index) => ({
					id: stableUuid(`rule-example:${rule.id}:${index + 1}`),
					order: index + 1,
					text,
					translation: null,
				})),
			});
		}
	}

	const lessons = thaiPack.lessons.map((lesson) => {
		const lessonSlug = lessonSlugs.get(lesson.id);
		if (!lessonSlug) {
			throw new Error(`Missing slug for lesson ${lesson.id}`);
		}

		const lessonId = stableUuid(`lesson:${lessonSlug}`);
		const anchorTargetId = stableUuid(`anchor:${lessonSlug}`);

		const vocabulary = lesson.vocabulary.map((entry, index) => {
			const key = vocabularyKey(entry.word.thai);
			return {
				itemId: stableUuid(`vocabulary:${key}`),
				key,
				roleKey: entry.role,
				ordinalInRole: lesson.vocabulary.filter((candidate, candidateIndex) => {
					return candidate.role === entry.role && candidateIndex <= index;
				}).length,
				isDrillTarget: entry.drillTarget,
				displayText: entry.word.thai,
				normalizedText: entry.word.thai,
				meaning: entry.word.meaning,
				pronunciation: entry.word.pronunciation,
				categoryKey: entry.word.category,
				contextNote: entry.word.contextNote ?? null,
				metadata: {},
				segments: entry.word.syllables.map((segment, segmentIndex) => ({
					id: stableUuid(`vocabulary-segment:${key}:${segmentIndex + 1}`),
					order: segmentIndex + 1,
					text: segment.thai,
					sound: segment.sound,
					kind: null,
					metadata: {},
				})),
			};
		});

		const anchorSegments = lesson.anchorWord.syllables.map((segment, index) => ({
			id: stableUuid(`anchor-segment:${lessonSlug}:${index + 1}`),
			order: index + 1,
			text: segment.thai,
			sound: segment.sound,
			kind: null,
			metadata: {},
		}));

		const lessonGraphemes = [
			...lesson.newLetters.map((letter, index) => ({
				graphemeId: graphemeByCharacter.get(letter.character).id,
				role: "new",
				ordinal: index + 1,
			})),
			...(lesson.reviewLetters ?? []).map((character, index) => ({
				graphemeId: graphemeByCharacter.get(character).id,
				role: "review",
				ordinal: index + 1,
			})),
		];

		const lessonRules = lesson.rulesIntroduced.map((rule, index) => ({
			ruleId: rulesById.get(rule.id).id,
			order: index + 1,
		}));

		const drills = lesson.drills.map((drill, index) => {
			const key = `${lessonSlug}-drill-${String(index + 1).padStart(2, "0")}-${drill.type}`;
			return {
				id: stableUuid(`drill:${key}`),
				key,
				type: drill.type,
				prompt: drill.prompt,
				hint: drill.hint ?? null,
				payload: {},
				order: index + 1,
				options: drill.options.map((text, optionIndex) => ({
					id: stableUuid(`drill-option:${key}:${optionIndex + 1}`),
					order: optionIndex + 1,
					text,
					isCorrect: optionIndex === drill.correctIndex,
					rationale: null,
				})),
			};
		});

		return {
			id: lessonId,
			slug: lessonSlug,
			lessonOrdinal: lesson.id,
			stage: lesson.stage,
			title: lesson.title,
			metadata: {},
			anchorTargetId,
			anchor: {
				slug: lessonSlug,
				displayText: lesson.anchorWord.thai,
				normalizedText: lesson.anchorWord.thai,
				meaning: lesson.anchorWord.meaning,
				pronunciation: lesson.anchorWord.pronunciation,
				categoryKey: lesson.anchorWord.category,
				contextNote: lesson.anchorWord.contextNote ?? null,
				metadata: {},
				segments: anchorSegments,
			},
			vocabulary,
			newGraphemes: lesson.newLetters.map((letter) =>
				graphemeByCharacter.get(letter.character),
			),
			reviewGraphemes: (lesson.reviewLetters ?? []).map((character) => {
				return graphemeByCharacter.get(character);
			}),
			rules: lesson.rulesIntroduced.map((rule) => rulesById.get(rule.id)),
			drills,
			lessonGraphemes,
			lessonRules,
		};
	});

	const vocabularyItems = Array.from(
		new Map(
			lessons.flatMap((lesson) => lesson.vocabulary.map((entry) => [entry.itemId, entry])),
		).values(),
	);

	const course = {
		id: courseId,
		slug: courseSlug,
		languageCode: "th",
		scriptSystemId,
		name: thaiPack.name,
		nativeName: thaiPack.nativeName,
		heroTitle: "Learn to read Thai",
		heroSubtitle:
			"Don't memorize an alphabet chart. Learn real words you'll see on streets, menus, and signs - and pick up the letters naturally.",
		seoTitle: "GlyphBridge — Learn Thai Through Real Words",
		seoDescription:
			"Learn to read Thai through real words, guided lesson steps, and short drills built around signs, menus, roads, and everyday language.",
		uiConfig: {},
	};

	const courseVersion = {
		id: courseVersionId,
		courseId,
		versionOrdinal: 1,
		displayVersion: "1.0.0",
		sourceLocale: "en",
		releaseTitle: "Thai frequency-first foundation",
		releaseSummary:
			"First 13-lesson Thai curriculum rewrite aligned to the frequency-first sequence in approach-thai.md.",
		releaseNotes: {
			source: "src/lib/data/thai.ts",
			conceptSource: "docs/concept/approach-thai.md",
			vocabularyModel: "anchor-plus-support",
		},
	};

	const publicationLessons = lessons.map((lesson) => {
		const payload = {
			course: {
				id: course.id,
				slug: course.slug,
				versionId: courseVersion.id,
				displayVersion: courseVersion.displayVersion,
			},
			lesson: {
				id: lesson.id,
				slug: lesson.slug,
				lessonOrdinal: lesson.lessonOrdinal,
				stage: lesson.stage,
				title: lesson.title,
				anchor: {
					id: lesson.anchorTargetId,
					slug: lesson.anchor.slug,
					text: lesson.anchor.displayText,
					meaning: lesson.anchor.meaning,
					pronunciation: lesson.anchor.pronunciation,
					categoryKey: lesson.anchor.categoryKey,
					...(lesson.anchor.contextNote
						? { contextNote: lesson.anchor.contextNote }
						: {}),
					segments: lesson.anchor.segments.map((segment) => ({
						text: segment.text,
						sound: segment.sound,
					})),
				},
				vocabulary: lesson.vocabulary.map((entry) => ({
					roleKey: entry.roleKey,
					ordinalInRole: entry.ordinalInRole,
					isDrillTarget: entry.isDrillTarget,
					item: {
						id: entry.itemId,
						key: entry.key,
						text: entry.displayText,
						meaning: entry.meaning,
						pronunciation: entry.pronunciation,
						categoryKey: entry.categoryKey,
						...(entry.contextNote ? { contextNote: entry.contextNote } : {}),
						segments: entry.segments.map((segment) => ({
							text: segment.text,
							sound: segment.sound,
						})),
						metadata: entry.metadata,
					},
				})),
				newGraphemes: lesson.newGraphemes.map((grapheme) => ({
					id: grapheme.id,
					text: grapheme.text,
					kind: grapheme.kind,
					romanization: grapheme.romanization,
					pronunciationHint: grapheme.pronunciationHint,
					mnemonic: grapheme.mnemonic,
					...(grapheme.position ? { position: grapheme.position } : {}),
					details: grapheme.details,
					tags: grapheme.tags,
				})),
				reviewGraphemes: lesson.reviewGraphemes.map((grapheme) => ({
					id: grapheme.id,
					text: grapheme.text,
					kind: grapheme.kind,
					romanization: grapheme.romanization,
					pronunciationHint: grapheme.pronunciationHint,
					mnemonic: grapheme.mnemonic,
					...(grapheme.position ? { position: grapheme.position } : {}),
					details: grapheme.details,
					tags: grapheme.tags,
				})),
				rules: lesson.rules.map((rule) => ({
					id: rule.id,
					key: rule.key,
					name: rule.name,
					shortDescription: rule.shortDescription,
					explanation: rule.explanation,
					examples: rule.examples.map((example) => ({ text: example.text })),
				})),
				drills: lesson.drills.map((drill) => ({
					id: drill.id,
					key: drill.key,
					type: drill.type,
					prompt: drill.prompt,
					...(drill.hint ? { hint: drill.hint } : {}),
					payload: drill.payload,
					options: drill.options.map((option) => ({
						text: option.text,
						...(option.isCorrect ? { isCorrect: true } : {}),
					})),
				})),
			},
		};

		return {
			id: stableUuid(`publication-lesson:${lesson.slug}`),
			lessonId: lesson.id,
			lessonSlug: lesson.slug,
			lessonOrdinal: lesson.lessonOrdinal,
			payload,
			payloadHash: hashJson(payload),
		};
	});

	const manifestHash = hashJson({
		publicationId,
		courseSlug: course.slug,
		displayVersion: courseVersion.displayVersion,
		lessonPayloadHashes: publicationLessons.map((lesson) => ({
			lessonSlug: lesson.lessonSlug,
			payloadHash: lesson.payloadHash,
		})),
	});

	const contentHash = hashJson({
		course,
		courseVersion: {
			versionOrdinal: courseVersion.versionOrdinal,
			displayVersion: courseVersion.displayVersion,
			releaseTitle: courseVersion.releaseTitle,
			releaseSummary: courseVersion.releaseSummary,
			releaseNotes: courseVersion.releaseNotes,
		},
		graphemes: Array.from(graphemeByCharacter.values()).map((grapheme) => ({
			key: grapheme.key,
			text: grapheme.text,
			kind: grapheme.kind,
			romanization: grapheme.romanization,
		})),
		lessons: lessons.map((lesson) => ({
			slug: lesson.slug,
			title: lesson.title,
			anchor: lesson.anchor.displayText,
			vocabulary: lesson.vocabulary.map((entry) => ({
				roleKey: entry.roleKey,
				text: entry.displayText,
			})),
			rules: lesson.rules.map((rule) => rule.key),
			drills: lesson.drills.map((drill) => drill.key),
		})),
	});

	return {
		course,
		courseVersion: { ...courseVersion, contentHash },
		releaseTimestamp,
		scriptSystem: {
			id: scriptSystemId,
			slug: "thai",
			name: "Thai script",
			nativeName: scriptSystemNativeName,
			direction: "ltr",
			metadata: {},
		},
		language: {
			code: "th",
			name: "Thai",
			nativeName: "ภาษาไทย",
			direction: "ltr",
		},
		graphemes: Array.from(graphemeByCharacter.values()),
		rules: Array.from(rulesById.values()),
		lessons,
		vocabularyItems,
		publication: {
			id: publicationId,
			manifestHash,
			lessons: publicationLessons,
		},
	};
}

function renderSql(model) {
	const sqlParts = [];

	sqlParts.push("-- Generated by scripts/generate-thai-seed.mjs from src/lib/data/thai.ts.");
	sqlParts.push("begin;\n");

	sqlParts.push(
		`insert into curriculum.languages (code, name, native_name, direction, created_at)\nvalues (${sqlString(model.language.code)}, ${sqlString(model.language.name)}, ${sqlString(model.language.nativeName)}, 'ltr'::curriculum.app_direction, ${sqlString(model.releaseTimestamp)}::timestamptz);\n`,
	);

	sqlParts.push(
		`insert into curriculum.script_systems (id, slug, name, native_name, direction, metadata, created_at)\nvalues (${sqlString(model.scriptSystem.id)}::uuid, ${sqlString(model.scriptSystem.slug)}, ${sqlString(model.scriptSystem.name)}, ${sqlString(model.scriptSystem.nativeName)}, 'ltr'::curriculum.app_direction, ${sqlJson(model.scriptSystem.metadata)}, ${sqlString(model.releaseTimestamp)}::timestamptz);\n`,
	);

	sqlParts.push(
		`insert into curriculum.courses (id, slug, language_code, script_system_id, name, native_name, hero_title, hero_subtitle, seo_title, seo_description, ui_config, is_active, created_at, updated_at)\nvalues (${sqlString(model.course.id)}::uuid, ${sqlString(model.course.slug)}, ${sqlString(model.language.code)}, ${sqlString(model.scriptSystem.id)}::uuid, ${sqlString(model.course.name)}, ${sqlString(model.course.nativeName)}, ${sqlString(model.course.heroTitle)}, ${sqlString(model.course.heroSubtitle)}, ${sqlString(model.course.seoTitle)}, ${sqlString(model.course.seoDescription)}, ${sqlJson(model.course.uiConfig)}, true, ${sqlString(model.releaseTimestamp)}::timestamptz, ${sqlString(model.releaseTimestamp)}::timestamptz);\n`,
	);

	sqlParts.push(
		`insert into curriculum.course_versions (id, course_id, version_ordinal, display_version, source_locale, status, release_title, release_summary, release_notes, content_hash, released_at, created_at)\nvalues (${sqlString(model.courseVersion.id)}::uuid, ${sqlString(model.course.id)}::uuid, ${model.courseVersion.versionOrdinal}, ${sqlString(model.courseVersion.displayVersion)}, ${sqlString(model.courseVersion.sourceLocale)}, 'published'::curriculum.course_version_status, ${sqlString(model.courseVersion.releaseTitle)}, ${sqlString(model.courseVersion.releaseSummary)}, ${sqlJson(model.courseVersion.releaseNotes)}, ${sqlString(model.courseVersion.contentHash)}, ${sqlString(model.releaseTimestamp)}::timestamptz, ${sqlString(model.releaseTimestamp)}::timestamptz);\n`,
	);

	sqlParts.push(
		`update curriculum.courses\nset current_published_version_id = ${sqlString(model.courseVersion.id)}::uuid,\n    updated_at = ${sqlString(model.releaseTimestamp)}::timestamptz\nwhere id = ${sqlString(model.course.id)}::uuid;\n`,
	);

	sqlParts.push(
		insertStatement(
			"curriculum.graphemes",
			[
				"id",
				"script_system_id",
				"key",
				"text",
				"kind",
				"sort_order",
				"unicode_codepoints",
				"metadata",
				"created_at",
			],
			model.graphemes.map((grapheme) => ({
				id: `${sqlString(grapheme.id)}::uuid`,
				script_system_id: `${sqlString(model.scriptSystem.id)}::uuid`,
				key: sqlString(grapheme.key),
				text: sqlString(grapheme.text),
				kind: sqlString(grapheme.kind),
				sort_order: String(grapheme.sortOrder),
				unicode_codepoints: sqlTextArray(grapheme.unicodeCodepoints),
				metadata: sqlJson(grapheme.metadata),
				created_at: `${sqlString(model.releaseTimestamp)}::timestamptz`,
			})),
		),
	);

	sqlParts.push(
		insertStatement(
			"curriculum.course_version_graphemes",
			[
				"course_version_id",
				"grapheme_id",
				"romanization",
				"pronunciation_hint",
				"mnemonic",
				"position",
				"pedagogical_group_key",
				"pedagogical_group_label",
				"details",
				"tags",
			],
			model.graphemes.map((grapheme) => ({
				course_version_id: `${sqlString(model.courseVersion.id)}::uuid`,
				grapheme_id: `${sqlString(grapheme.id)}::uuid`,
				romanization: sqlString(grapheme.romanization),
				pronunciation_hint: sqlString(grapheme.pronunciationHint),
				mnemonic: sqlString(grapheme.mnemonic),
				position: grapheme.position ? sqlString(grapheme.position) : "null",
				pedagogical_group_key: "null",
				pedagogical_group_label: "null",
				details: sqlJson(grapheme.details),
				tags: sqlTextArray(grapheme.tags),
			})),
		),
	);

	sqlParts.push(
		insertStatement(
			"curriculum.lessons",
			[
				"id",
				"course_version_id",
				"slug",
				"lesson_ordinal",
				"stage",
				"title",
				"metadata",
				"created_at",
			],
			model.lessons.map((lesson) => ({
				id: `${sqlString(lesson.id)}::uuid`,
				course_version_id: `${sqlString(model.courseVersion.id)}::uuid`,
				slug: sqlString(lesson.slug),
				lesson_ordinal: String(lesson.lessonOrdinal),
				stage: String(lesson.stage),
				title: sqlString(lesson.title),
				metadata: sqlJson(lesson.metadata),
				created_at: `${sqlString(model.releaseTimestamp)}::timestamptz`,
			})),
		),
	);

	sqlParts.push(
		insertStatement(
			"curriculum.vocabulary_items",
			[
				"id",
				"course_version_id",
				"key",
				"display_text",
				"normalized_text",
				"meaning",
				"pronunciation",
				"category_key",
				"context_note",
				"metadata",
				"created_at",
			],
			model.vocabularyItems.map((item) => ({
				id: `${sqlString(item.itemId)}::uuid`,
				course_version_id: `${sqlString(model.courseVersion.id)}::uuid`,
				key: sqlString(item.key),
				display_text: sqlString(item.displayText),
				normalized_text: sqlString(item.normalizedText),
				meaning: sqlString(item.meaning),
				pronunciation: sqlString(item.pronunciation),
				category_key: item.categoryKey ? sqlString(item.categoryKey) : "null",
				context_note: item.contextNote ? sqlString(item.contextNote) : "null",
				metadata: sqlJson(item.metadata),
				created_at: `${sqlString(model.releaseTimestamp)}::timestamptz`,
			})),
		),
	);

	sqlParts.push(
		insertStatement(
			"curriculum.vocabulary_segments",
			["id", "vocabulary_item_id", "segment_order", "text", "sound", "kind", "metadata"],
			model.vocabularyItems.flatMap((item) => {
				return item.segments.map((segment) => ({
					id: `${sqlString(segment.id)}::uuid`,
					vocabulary_item_id: `${sqlString(item.itemId)}::uuid`,
					segment_order: String(segment.order),
					text: sqlString(segment.text),
					sound: sqlString(segment.sound),
					kind: "null",
					metadata: sqlJson(segment.metadata),
				}));
			}),
		),
	);

	sqlParts.push(
		insertStatement(
			"curriculum.lesson_vocabulary",
			[
				"lesson_id",
				"vocabulary_item_id",
				"role_key",
				"ordinal_in_role",
				"is_drill_target",
				"metadata",
			],
			model.lessons.flatMap((lesson) => {
				return lesson.vocabulary.map((item) => ({
					lesson_id: `${sqlString(lesson.id)}::uuid`,
					vocabulary_item_id: `${sqlString(item.itemId)}::uuid`,
					role_key: sqlString(item.roleKey),
					ordinal_in_role: String(item.ordinalInRole),
					is_drill_target: item.isDrillTarget ? "true" : "false",
					metadata: sqlJson(item.metadata),
				}));
			}),
		),
	);

	sqlParts.push(
		insertStatement(
			"curriculum.anchor_targets",
			[
				"id",
				"lesson_id",
				"slug",
				"display_text",
				"normalized_text",
				"meaning",
				"pronunciation",
				"category_key",
				"context_note",
				"metadata",
			],
			model.lessons.map((lesson) => ({
				id: `${sqlString(lesson.anchorTargetId)}::uuid`,
				lesson_id: `${sqlString(lesson.id)}::uuid`,
				slug: sqlString(lesson.anchor.slug),
				display_text: sqlString(lesson.anchor.displayText),
				normalized_text: sqlString(lesson.anchor.normalizedText),
				meaning: sqlString(lesson.anchor.meaning),
				pronunciation: sqlString(lesson.anchor.pronunciation),
				category_key: sqlString(lesson.anchor.categoryKey),
				context_note: lesson.anchor.contextNote
					? sqlString(lesson.anchor.contextNote)
					: "null",
				metadata: sqlJson(lesson.anchor.metadata),
			})),
		),
	);

	sqlParts.push(
		insertStatement(
			"curriculum.anchor_segments",
			["id", "anchor_target_id", "segment_order", "text", "sound", "kind", "metadata"],
			model.lessons.flatMap((lesson) => {
				return lesson.anchor.segments.map((segment) => ({
					id: `${sqlString(segment.id)}::uuid`,
					anchor_target_id: `${sqlString(lesson.anchorTargetId)}::uuid`,
					segment_order: String(segment.order),
					text: sqlString(segment.text),
					sound: sqlString(segment.sound),
					kind: "null",
					metadata: sqlJson(segment.metadata),
				}));
			}),
		),
	);

	sqlParts.push(
		insertStatement(
			"curriculum.orthography_rules",
			[
				"id",
				"course_version_id",
				"key",
				"name",
				"short_description",
				"explanation",
				"metadata",
				"created_at",
			],
			model.rules.map((rule) => ({
				id: `${sqlString(rule.id)}::uuid`,
				course_version_id: `${sqlString(model.courseVersion.id)}::uuid`,
				key: sqlString(rule.key),
				name: sqlString(rule.name),
				short_description: sqlString(rule.shortDescription),
				explanation: sqlString(rule.explanation),
				metadata: sqlJson(rule.metadata),
				created_at: `${sqlString(model.releaseTimestamp)}::timestamptz`,
			})),
		),
	);

	sqlParts.push(
		insertStatement(
			"curriculum.orthography_rule_examples",
			["id", "rule_id", "example_order", "text", "translation"],
			model.rules.flatMap((rule) => {
				return rule.examples.map((example) => ({
					id: `${sqlString(example.id)}::uuid`,
					rule_id: `${sqlString(rule.id)}::uuid`,
					example_order: String(example.order),
					text: sqlString(example.text),
					translation: "null",
				}));
			}),
		),
	);

	sqlParts.push(
		insertStatement(
			"curriculum.lesson_graphemes",
			["lesson_id", "grapheme_id", "role", "ordinal_in_role"],
			model.lessons.flatMap((lesson) => {
				return lesson.lessonGraphemes.map((item) => ({
					lesson_id: `${sqlString(lesson.id)}::uuid`,
					grapheme_id: `${sqlString(item.graphemeId)}::uuid`,
					role: `${sqlString(item.role)}::curriculum.grapheme_role`,
					ordinal_in_role: String(item.ordinal),
				}));
			}),
		),
	);

	sqlParts.push(
		insertStatement(
			"curriculum.lesson_rules",
			["lesson_id", "rule_id", "rule_order"],
			model.lessons.flatMap((lesson) => {
				return lesson.lessonRules.map((item) => ({
					lesson_id: `${sqlString(lesson.id)}::uuid`,
					rule_id: `${sqlString(item.ruleId)}::uuid`,
					rule_order: String(item.order),
				}));
			}),
		),
	);

	const allDrills = model.lessons.flatMap((lesson) => lesson.drills);

	sqlParts.push(
		insertStatement(
			"curriculum.drills",
			["id", "course_version_id", "key", "type", "prompt", "hint", "payload", "created_at"],
			allDrills.map((drill) => ({
				id: `${sqlString(drill.id)}::uuid`,
				course_version_id: `${sqlString(model.courseVersion.id)}::uuid`,
				key: sqlString(drill.key),
				type: `${sqlString(drill.type)}::curriculum.drill_type`,
				prompt: sqlString(drill.prompt),
				hint: drill.hint ? sqlString(drill.hint) : "null",
				payload: sqlJson(drill.payload),
				created_at: `${sqlString(model.releaseTimestamp)}::timestamptz`,
			})),
		),
	);

	sqlParts.push(
		insertStatement(
			"curriculum.drill_options",
			["id", "drill_id", "option_order", "text", "is_correct", "rationale"],
			allDrills.flatMap((drill) => {
				return drill.options.map((option) => ({
					id: `${sqlString(option.id)}::uuid`,
					drill_id: `${sqlString(drill.id)}::uuid`,
					option_order: String(option.order),
					text: sqlString(option.text),
					is_correct: option.isCorrect ? "true" : "false",
					rationale: "null",
				}));
			}),
		),
	);

	sqlParts.push(
		insertStatement(
			"curriculum.lesson_drills",
			["lesson_id", "drill_id", "drill_order"],
			model.lessons.flatMap((lesson) => {
				return lesson.drills.map((drill) => ({
					lesson_id: `${sqlString(lesson.id)}::uuid`,
					drill_id: `${sqlString(drill.id)}::uuid`,
					drill_order: String(drill.order),
				}));
			}),
		),
	);

	sqlParts.push(
		`insert into delivery.course_publications (id, course_version_id, manifest_hash, is_active, created_at)\nvalues (${sqlString(model.publication.id)}::uuid, ${sqlString(model.courseVersion.id)}::uuid, ${sqlString(model.publication.manifestHash)}, true, ${sqlString(model.releaseTimestamp)}::timestamptz);\n`,
	);

	sqlParts.push(
		insertStatement(
			"delivery.course_publication_lessons",
			[
				"id",
				"publication_id",
				"lesson_id",
				"lesson_slug",
				"lesson_ordinal",
				"payload",
				"payload_hash",
				"created_at",
			],
			model.publication.lessons.map((lesson) => ({
				id: `${sqlString(lesson.id)}::uuid`,
				publication_id: `${sqlString(model.publication.id)}::uuid`,
				lesson_id: `${sqlString(lesson.lessonId)}::uuid`,
				lesson_slug: sqlString(lesson.lessonSlug),
				lesson_ordinal: String(lesson.lessonOrdinal),
				payload: sqlJson(lesson.payload),
				payload_hash: sqlString(lesson.payloadHash),
				created_at: `${sqlString(model.releaseTimestamp)}::timestamptz`,
			})),
		),
	);

	sqlParts.push("commit;\n");

	return sqlParts.join("\n");
}

process.stdout.write(renderSql(buildSeedModel()));
