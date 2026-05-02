import { error } from "@sveltejs/kit";

import { getPublishedLesson } from "$lib/server/delivery-lessons";

import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async ({ params }) => {
	if (!/^\d+$/.test(params.id)) {
		throw error(404, "Lesson not found");
	}

	const lessonId = Number(params.id);
	if (!Number.isFinite(lessonId) || lessonId < 1) {
		throw error(404, "Lesson not found");
	}

	const { lesson, nextLessonId } = await getPublishedLesson(lessonId);

	return { lesson, nextLessonId };
};
