import { json } from "@sveltejs/kit";

import type { LearnerProjectionEnvelope } from "$lib/data/learner";
import { getSupabaseClient, getVerifiedUser } from "$lib/server/auth";
import { getLearnerProjection } from "$lib/server/learner-projection";

import type { RequestHandler } from "./$types";

export const prerender = false;

function projectionJson(envelope: LearnerProjectionEnvelope, status = 200): Response {
	return json(envelope, {
		headers: {
			"cache-control": "no-store",
		},
		status,
	});
}

export const GET: RequestHandler = async ({ locals }) => {
	const user = await getVerifiedUser(locals);

	if (!user) {
		return projectionJson({
			auth: { authenticated: false, email: null },
			projection: null,
		});
	}

	const supabase = getSupabaseClient(locals);
	const projection = await getLearnerProjection(supabase);

	return projectionJson({
		auth: { authenticated: true, email: user.email ?? null },
		projection,
	});
};
