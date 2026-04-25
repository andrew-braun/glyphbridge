import { error } from "@sveltejs/kit";

import { thaiPack } from "$lib/data/thai";

import type { PageLoad } from "./$types";

export const prerender = false;

export const load: PageLoad = ({ params }) => {
	const lessonId = parseInt(params.id, 10);
	const lesson = thaiPack.lessons.find((l) => l.id === lessonId);

	if (!lesson) {
		throw error(404, "Lesson not found");
	}

	return { lesson };
};
