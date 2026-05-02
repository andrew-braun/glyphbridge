import type { DrillQuestion, Lesson, Letter, Rule, Word } from "../data/types";

export type PublishedLessonCard = Pick<
	Lesson,
	"id" | "stage" | "title" | "anchorWord" | "newLetters"
>;

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

export class DeliveryPayloadError extends Error {}

function fail(context: string): never {
	throw new DeliveryPayloadError(`Invalid published lesson payload at ${context}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function expectRecord(value: unknown, context: string): Record<string, unknown> {
	if (!isRecord(value)) {
		fail(context);
	}

	return value;
}

function expectString(value: unknown, context: string): string {
	if (typeof value !== "string" || value.length === 0) {
		fail(context);
	}

	return value;
}

function readOptionalString(value: unknown): string | undefined {
	return typeof value === "string" && value.length > 0 ? value : undefined;
}

function expectInteger(value: unknown, context: string): number {
	if (typeof value !== "number" || !Number.isInteger(value)) {
		fail(context);
	}

	return value;
}

function expectArray(value: unknown, context: string): unknown[] {
	if (!Array.isArray(value)) {
		fail(context);
	}

	return value;
}

function expectEnum<T>(allowed: Set<T>, value: unknown, context: string): T {
	if (typeof value !== "string" || !allowed.has(value as T)) {
		fail(context);
	}

	return value as T;
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
		category: expectEnum(wordCategories, record.categoryKey, `${context}.categoryKey`),
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
			: expectEnum(letterClasses, candidateClass, `${context}.details.class`);
	const position =
		record.position === undefined
			? undefined
			: expectEnum(letterPositions, record.position, `${context}.position`);

	return {
		character: expectString(record.text, `${context}.text`),
		romanization: expectString(record.romanization, `${context}.romanization`),
		pronunciation: expectString(record.pronunciationHint, `${context}.pronunciationHint`),
		type: expectEnum(letterTypes, record.kind, `${context}.kind`),
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
		fail(`${context}.options`);
	}

	const hint = readOptionalString(record.hint);

	return {
		type: expectEnum(drillTypes, record.type, `${context}.type`),
		prompt: expectString(record.prompt, `${context}.prompt`),
		options: options.map((option) => option.text),
		correctIndex: correctIndexes[0],
		...(hint ? { hint } : {}),
	};
}

function readLessonCore(payload: unknown): {
	lesson: Record<string, unknown>;
	reviewLetters: string[];
} {
	const payloadRecord = expectRecord(payload, "payload");
	const lesson = expectRecord(payloadRecord.lesson, "payload.lesson");
	const reviewGraphemes = expectArray(lesson.reviewGraphemes, "payload.lesson.reviewGraphemes");
	const reviewLetters = reviewGraphemes.map((grapheme, index) => {
		const graphemeRecord = expectRecord(grapheme, `payload.lesson.reviewGraphemes[${index}]`);

		return expectString(graphemeRecord.text, `payload.lesson.reviewGraphemes[${index}].text`);
	});

	return { lesson, reviewLetters };
}

export function mapPublishedLessonCard(payload: unknown): PublishedLessonCard {
	const { lesson } = readLessonCore(payload);

	return {
		id: expectInteger(lesson.lessonOrdinal, "payload.lesson.lessonOrdinal"),
		stage: expectInteger(lesson.stage, "payload.lesson.stage"),
		title: expectString(lesson.title, "payload.lesson.title"),
		anchorWord: mapWord(lesson.anchor, "payload.lesson.anchor"),
		newLetters: expectArray(lesson.newGraphemes, "payload.lesson.newGraphemes").map(
			(grapheme, index) => mapLetter(grapheme, `payload.lesson.newGraphemes[${index}]`),
		),
	};
}

export function mapPublishedLessonPayload(payload: unknown): Lesson {
	const { lesson, reviewLetters } = readLessonCore(payload);

	return {
		id: expectInteger(lesson.lessonOrdinal, "payload.lesson.lessonOrdinal"),
		stage: expectInteger(lesson.stage, "payload.lesson.stage"),
		title: expectString(lesson.title, "payload.lesson.title"),
		anchorWord: mapWord(lesson.anchor, "payload.lesson.anchor"),
		vocabulary: expectArray(lesson.vocabulary, "payload.lesson.vocabulary").flatMap(
			(entry, index) => {
				const entryRecord = expectRecord(entry, `payload.lesson.vocabulary[${index}]`);
				const role = expectEnum(
					lessonVocabularyRoles,
					entryRecord.roleKey,
					`payload.lesson.vocabulary[${index}].roleKey`,
				);

				if (role === "anchor") return [];

				return [
					{
						role,
						drillTarget: entryRecord.isDrillTarget === true,
						word: mapWord(entryRecord.item, `payload.lesson.vocabulary[${index}].item`),
					},
				];
			},
		),
		newLetters: expectArray(lesson.newGraphemes, "payload.lesson.newGraphemes").map(
			(grapheme, index) => mapLetter(grapheme, `payload.lesson.newGraphemes[${index}]`),
		),
		rulesIntroduced: expectArray(lesson.rules, "payload.lesson.rules").map((rule, index) =>
			mapRule(rule, `payload.lesson.rules[${index}]`),
		),
		drills: expectArray(lesson.drills, "payload.lesson.drills").map((drill, index) =>
			mapDrill(drill, `payload.lesson.drills[${index}]`),
		),
		...(reviewLetters.length > 0 ? { reviewLetters } : {}),
	};
}
