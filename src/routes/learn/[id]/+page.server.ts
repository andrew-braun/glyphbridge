import { error } from "@sveltejs/kit";

import { getNextPublishedLessonId, getPublishedLessonById } from "$lib/server/delivery-lessons";

import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async ({ params }) => {
	const lessonId = Number.parseInt(params.id, 10);
	if (!Number.isInteger(lessonId) || lessonId < 1) {
		throw error(404, "Lesson not found");
	}

	const [lesson, nextLessonId] = await Promise.all([
		getPublishedLessonById(lessonId),
		getNextPublishedLessonId(lessonId),
	]);

	return { lesson, nextLessonId };
};
