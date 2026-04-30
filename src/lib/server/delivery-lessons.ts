import { createClient } from "@supabase/supabase-js";
import { error } from "@sveltejs/kit";

import { env } from "$env/dynamic/public";
import type { DrillQuestion, Lesson, Letter, Rule, Word } from "$lib/data/types";

const wordCategories = new Set<Word["category"]>(["place", "food", "transport", "daily", "sign"]);
const letterTypes = new Set<Letter["type"]>(["consonant", "vowel", "tone_mark"]);
const letterClasses = new Set<NonNullable<Letter["class"]>>(["low", "mid", "high"]);
const letterPositions = new Set<NonNullable<Letter["position"]>>([
	"left",
	"right",
	"above",
	"below",
	"around",
	"standalone",
]);
const lessonVocabularyRoles = new Set<"anchor" | "support">(["anchor", "support"]);
const drillTypes = new Set<DrillQuestion["type"]>(["recognize", "match", "sound", "spot"]);

type ActivePublicationRow = {
	id: string;
};

type PublicationLessonRow = {
	lesson_ordinal: number;
	payload: unknown;
};

export type PublishedLessonCard = Pick<
	Lesson,
	"id" | "stage" | "title" | "anchorWord" | "newLetters"
>;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function expectRecord(value: unknown, context: string): Record<string, unknown> {
	if (!isRecord(value)) {
		throw error(500, `Invalid published lesson payload at ${context}`);
	}

	return value;
}

function expectString(value: unknown, context: string): string {
	if (typeof value !== "string" || value.length === 0) {
		throw error(500, `Invalid published lesson payload at ${context}`);
	}

	return value;
}

function readOptionalString(value: unknown): string | undefined {
	return typeof value === "string" && value.length > 0 ? value : undefined;
}

function expectInteger(value: unknown, context: string): number {
	if (typeof value !== "number" || !Number.isInteger(value)) {
		throw error(500, `Invalid published lesson payload at ${context}`);
	}

	return value;
}

function expectArray(value: unknown, context: string): unknown[] {
	if (!Array.isArray(value)) {
		throw error(500, `Invalid published lesson payload at ${context}`);
	}

	return value;
}

function expectWordCategory(value: unknown, context: string): Word["category"] {
	if (typeof value !== "string" || !wordCategories.has(value as Word["category"])) {
		throw error(500, `Invalid published lesson payload at ${context}`);
	}

	return value as Word["category"];
}

function expectLetterType(value: unknown, context: string): Letter["type"] {
	if (typeof value !== "string" || !letterTypes.has(value as Letter["type"])) {
		throw error(500, `Invalid published lesson payload at ${context}`);
	}

	return value as Letter["type"];
}

function expectLetterClass(value: unknown, context: string): NonNullable<Letter["class"]> {
	if (typeof value !== "string" || !letterClasses.has(value as NonNullable<Letter["class"]>)) {
		throw error(500, `Invalid published lesson payload at ${context}`);
	}

	return value as NonNullable<Letter["class"]>;
}

function expectLetterPosition(value: unknown, context: string): NonNullable<Letter["position"]> {
	if (
		typeof value !== "string" ||
		!letterPositions.has(value as NonNullable<Letter["position"]>)
	) {
		throw error(500, `Invalid published lesson payload at ${context}`);
	}

	return value as NonNullable<Letter["position"]>;
}

function expectVocabularyRole(value: unknown, context: string): "anchor" | "support" {
	if (typeof value !== "string" || !lessonVocabularyRoles.has(value as "anchor" | "support")) {
		throw error(500, `Invalid published lesson payload at ${context}`);
	}

	return value as "anchor" | "support";
}

function expectDrillType(value: unknown, context: string): DrillQuestion["type"] {
	if (typeof value !== "string" || !drillTypes.has(value as DrillQuestion["type"])) {
		throw error(500, `Invalid published lesson payload at ${context}`);
	}

	return value as DrillQuestion["type"];
}

function createDeliveryClient() {
	const supabaseUrl = env.PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw error(
			503,
			"Supabase delivery reads are not configured. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY. For local Supabase, run `pnpm exec supabase status -o env` and map API_URL/PUBLISHABLE_KEY into those variables.",
		);
	}

	return createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}

async function getActivePublicationId(): Promise<string> {
	const delivery = createDeliveryClient().schema("delivery");
	const { data, error: selectError } = await delivery
		.from("course_publications")
		.select("id")
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
		throw error(500, "The current learn routes require exactly one active lesson publication");
	}

	return data[0].id;
}

function mapWord(value: unknown, context: string): Word {
	const record = expectRecord(value, context);
	const syllables = expectArray(record.segments, `${context}.segments`).map((segment, index) => {
		const segmentRecord = expectRecord(segment, `${context}.segments[${index}]`);

		return {
			thai: expectString(segmentRecord.text, `${context}.segments[${index}].text`),
			sound: expectString(segmentRecord.sound, `${context}.segments[${index}].sound`),
		};
	});

	const contextNote = readOptionalString(record.contextNote);

	return {
		thai: expectString(record.text, `${context}.text`),
		meaning: expectString(record.meaning, `${context}.meaning`),
		pronunciation: expectString(record.pronunciation, `${context}.pronunciation`),
		category: expectWordCategory(record.categoryKey, `${context}.categoryKey`),
		syllables,
		...(contextNote ? { contextNote } : {}),
	};
}

function mapLetter(value: unknown, context: string): Letter {
	const record = expectRecord(value, context);
	const details = isRecord(record.details) ? record.details : {};
	const candidateClass = details.class;
	const className =
		candidateClass === undefined
			? undefined
			: expectLetterClass(candidateClass, `${context}.details.class`);
	const position =
		record.position === undefined
			? undefined
			: expectLetterPosition(record.position, `${context}.position`);

	return {
		character: expectString(record.text, `${context}.text`),
		romanization: expectString(record.romanization, `${context}.romanization`),
		pronunciation: expectString(record.pronunciationHint, `${context}.pronunciationHint`),
		type: expectLetterType(record.kind, `${context}.kind`),
		mnemonic: expectString(record.mnemonic, `${context}.mnemonic`),
		...(className ? { class: className } : {}),
		...(position ? { position } : {}),
	};
}

function mapRule(value: unknown, context: string): Rule {
	const record = expectRecord(value, context);
	const examples = expectArray(record.examples, `${context}.examples`).map((example, index) => {
		const exampleRecord = expectRecord(example, `${context}.examples[${index}]`);

		return expectString(exampleRecord.text, `${context}.examples[${index}].text`);
	});

	return {
		id: expectString(record.key, `${context}.key`),
		name: expectString(record.name, `${context}.name`),
		shortDescription: expectString(record.shortDescription, `${context}.shortDescription`),
		explanation: expectString(record.explanation, `${context}.explanation`),
		examples,
	};
}

function mapDrill(value: unknown, context: string): DrillQuestion {
	const record = expectRecord(value, context);
	const options = expectArray(record.options, `${context}.options`).map((option, index) => {
		const optionRecord = expectRecord(option, `${context}.options[${index}]`);

		return {
			text: expectString(optionRecord.text, `${context}.options[${index}].text`),
			isCorrect: optionRecord.isCorrect === true,
		};
	});

	const correctIndexes = options.flatMap((option, index) => (option.isCorrect ? [index] : []));
	if (correctIndexes.length !== 1) {
		throw error(500, `Invalid published lesson payload at ${context}.options`);
	}

	const hint = readOptionalString(record.hint);

	return {
		type: expectDrillType(record.type, `${context}.type`),
		prompt: expectString(record.prompt, `${context}.prompt`),
		options: options.map((option) => option.text),
		correctIndex: correctIndexes[0],
		...(hint ? { hint } : {}),
	};
}

function mapLesson(payload: unknown): Lesson {
	const payloadRecord = expectRecord(payload, "payload");
	const lesson = expectRecord(payloadRecord.lesson, "payload.lesson");
	const reviewGraphemes = expectArray(lesson.reviewGraphemes, "payload.lesson.reviewGraphemes");
	const reviewLetters = reviewGraphemes.map((grapheme, index) => {
		const graphemeRecord = expectRecord(grapheme, `payload.lesson.reviewGraphemes[${index}]`);

		return expectString(graphemeRecord.text, `payload.lesson.reviewGraphemes[${index}].text`);
	});

	return {
		id: expectInteger(lesson.lessonOrdinal, "payload.lesson.lessonOrdinal"),
		stage: expectInteger(lesson.stage, "payload.lesson.stage"),
		title: expectString(lesson.title, "payload.lesson.title"),
		anchorWord: mapWord(lesson.anchor, "payload.lesson.anchor"),
		vocabulary: expectArray(lesson.vocabulary, "payload.lesson.vocabulary").map(
			(entry, index) => {
				const entryRecord = expectRecord(entry, `payload.lesson.vocabulary[${index}]`);

				return {
					role: expectVocabularyRole(
						entryRecord.roleKey,
						`payload.lesson.vocabulary[${index}].roleKey`,
					),
					drillTarget: entryRecord.isDrillTarget === true,
					word: mapWord(entryRecord.item, `payload.lesson.vocabulary[${index}].item`),
				};
			},
		),
		newLetters: expectArray(lesson.newGraphemes, "payload.lesson.newGraphemes").map(
			(grapheme, index) => {
				return mapLetter(grapheme, `payload.lesson.newGraphemes[${index}]`);
			},
		),
		rulesIntroduced: expectArray(lesson.rules, "payload.lesson.rules").map((rule, index) => {
			return mapRule(rule, `payload.lesson.rules[${index}]`);
		}),
		drills: expectArray(lesson.drills, "payload.lesson.drills").map((drill, index) => {
			return mapDrill(drill, `payload.lesson.drills[${index}]`);
		}),
		...(reviewLetters.length > 0 ? { reviewLetters } : {}),
	};
}

async function listPublicationLessons(publicationId: string): Promise<PublicationLessonRow[]> {
	const delivery = createDeliveryClient().schema("delivery");
	const { data, error: selectError } = await delivery
		.from("course_publication_lessons")
		.select("lesson_ordinal, payload")
		.eq("publication_id", publicationId)
		.order("lesson_ordinal", { ascending: true })
		.returns<PublicationLessonRow[]>();

	if (selectError) {
		throw error(500, "Unable to load published lessons");
	}

	return data ?? [];
}

export async function getPublishedLessonCards(): Promise<PublishedLessonCard[]> {
	const publicationId = await getActivePublicationId();
	const rows = await listPublicationLessons(publicationId);

	return rows.map((row) => {
		const lesson = mapLesson(row.payload);

		return {
			id: lesson.id,
			stage: lesson.stage,
			title: lesson.title,
			anchorWord: lesson.anchorWord,
			newLetters: lesson.newLetters,
		};
	});
}

export async function getPublishedLessonById(lessonId: number): Promise<Lesson> {
	const publicationId = await getActivePublicationId();
	const delivery = createDeliveryClient().schema("delivery");
	const { data, error: selectError } = await delivery
		.from("course_publication_lessons")
		.select("payload")
		.eq("publication_id", publicationId)
		.eq("lesson_ordinal", lessonId)
		.limit(2)
		.returns<Array<Pick<PublicationLessonRow, "payload">>>();

	if (selectError) {
		throw error(500, "Unable to load the requested lesson");
	}

	if (!data || data.length === 0) {
		throw error(404, "Lesson not found");
	}

	if (data.length > 1) {
		throw error(500, "Multiple published lessons matched the requested lesson ordinal");
	}

	return mapLesson(data[0].payload);
}

export async function getNextPublishedLessonId(lessonId: number): Promise<number | null> {
	const publicationId = await getActivePublicationId();
	const delivery = createDeliveryClient().schema("delivery");
	const { data, error: selectError } = await delivery
		.from("course_publication_lessons")
		.select("lesson_ordinal")
		.eq("publication_id", publicationId)
		.gt("lesson_ordinal", lessonId)
		.order("lesson_ordinal", { ascending: true })
		.limit(1)
		.returns<Array<Pick<PublicationLessonRow, "lesson_ordinal">>>();

	if (selectError) {
		throw error(500, "Unable to load lesson navigation");
	}

	return data?.[0]?.lesson_ordinal ?? null;
}
