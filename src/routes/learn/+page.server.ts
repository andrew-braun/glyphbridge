import { getPublishedLessonCards } from "$lib/server/delivery-lessons";

import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async () => {
	return {
		lessons: await getPublishedLessonCards(),
	};
};
