import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { error } from "@sveltejs/kit";

import { env } from "$env/dynamic/private";
import type { Lesson } from "$lib/data/types";

import {
	DeliveryPayloadError,
	mapPublishedLessonCard,
	mapPublishedLessonPayload,
	type PublishedLessonCard,
} from "./delivery-payload";

export type { PublishedLessonCard };

type ActivePublicationRow = {
	id: string;
};

type PublicationLessonRow = {
	lesson_ordinal: number;
	payload: unknown;
};

let deliveryClient: SupabaseClient | null = null;

function getDeliveryClient(): SupabaseClient {
	if (deliveryClient) return deliveryClient;

	const supabaseUrl = env.SUPABASE_DELIVERY_URL;
	const supabaseAnonKey = env.SUPABASE_DELIVERY_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw error(
			503,
			"Supabase delivery reads are not configured. Set SUPABASE_DELIVERY_URL and SUPABASE_DELIVERY_ANON_KEY. For local Supabase, run `pnpm exec supabase status -o env` and map API_URL -> SUPABASE_DELIVERY_URL and PUBLISHABLE_KEY -> SUPABASE_DELIVERY_ANON_KEY.",
		);
	}

	deliveryClient = createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});

	return deliveryClient;
}

let cachedPublicationId: string | null = null;
let publicationIdCachedAt = 0;
const PUBLICATION_CACHE_TTL_MS = 60_000;

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

function mapCard(payload: unknown): PublishedLessonCard {
	try {
		return mapPublishedLessonCard(payload);
	} catch (mappingError) {
		if (mappingError instanceof DeliveryPayloadError) {
			throw error(500, mappingError.message);
		}

		throw mappingError;
	}
}

async function getActivePublicationId(): Promise<string> {
	const now = Date.now();
	if (cachedPublicationId && now - publicationIdCachedAt < PUBLICATION_CACHE_TTL_MS) {
		return cachedPublicationId;
	}

	const delivery = getDeliveryClient().schema("delivery");
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

	cachedPublicationId = data[0].id;
	publicationIdCachedAt = now;

	return cachedPublicationId;
}

async function listPublicationLessons(publicationId: string): Promise<PublicationLessonRow[]> {
	const delivery = getDeliveryClient().schema("delivery");
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

	return rows.map((row) => mapCard(row.payload));
}

export async function getPublishedLesson(
	lessonId: number,
): Promise<{ lesson: Lesson; nextLessonId: number | null }> {
	const publicationId = await getActivePublicationId();
	const delivery = getDeliveryClient().schema("delivery");

	const { data, error: selectError } = await delivery
		.from("course_publication_lessons")
		.select("lesson_ordinal, payload")
		.eq("publication_id", publicationId)
		.gte("lesson_ordinal", lessonId)
		.order("lesson_ordinal", { ascending: true })
		.limit(2)
		.returns<PublicationLessonRow[]>();

	if (selectError) {
		throw error(500, "Unable to load the requested lesson");
	}

	const current = data?.[0];

	if (!current || current.lesson_ordinal !== lessonId) {
		throw error(404, "Lesson not found");
	}

	const next = data[1];

	return {
		lesson: mapLesson(current.payload),
		nextLessonId: next?.lesson_ordinal ?? null,
	};
}
