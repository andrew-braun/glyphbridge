import { getPublishedLessonCards, getPublishedLessonVersion } from "$lib/server/published-lessons";

import type { PageServerLoad } from "./$types";

export const prerender = true;

export const load: PageServerLoad = async () => {
	const [publication, lessons] = await Promise.all([
		getPublishedLessonVersion(),
		getPublishedLessonCards(),
	]);

	return {
		publication,
		lessons,
	};
};
