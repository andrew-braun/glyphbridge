import { createClient } from "@supabase/supabase-js";
import { error } from "@sveltejs/kit";

import { env } from "$env/dynamic/public";
import type { Lesson } from "$lib/data/types";

import { DeliveryPayloadError, mapPublishedLessonPayload } from "./delivery-payload";

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

function mapLesson(payload: unknown): Lesson {
	try {
		return mapPublishedLessonPayload(payload);
	} catch (mappingError) {
		if (mappingError instanceof DeliveryPayloadError) {
			throw error(500, mappingError.message);
		}

		throw mappingError;
	}
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
