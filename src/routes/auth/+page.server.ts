import { fail, redirect } from "@sveltejs/kit";

import {
	getSafeRedirectPath,
	getSupabaseClient,
	getVerifiedUser,
	normalizeEmail,
	normalizeEmailOtp,
	readRequiredFormString,
} from "$lib/server/auth";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = await getVerifiedUser(locals);

	return {
		authConfigured: locals.authConfigured,
		next: getSafeRedirectPath(url.searchParams.get("next") ?? "/auth"),
		userEmail: user?.email ?? null,
	};
};

export const actions: Actions = {
	requestCode: async ({ locals, request }) => {
		const formData = await request.formData();
		const email = normalizeEmail(readRequiredFormString(formData, "email"));

		if (!email) {
			return fail(400, {
				email: "",
				requestError: "Enter a valid email address.",
			});
		}

		const supabase = getSupabaseClient(locals);
		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				shouldCreateUser: true,
			},
		});

		if (error) {
			return fail(400, {
				email,
				requestError: "We could not send a code right now. Try again in a moment.",
			});
		}

		return {
			codeRequested: true,
			email,
		};
	},
	verifyCode: async ({ locals, request }) => {
		const formData = await request.formData();
		const email = normalizeEmail(readRequiredFormString(formData, "email"));
		const token = normalizeEmailOtp(readRequiredFormString(formData, "token"));
		const next = getSafeRedirectPath(readRequiredFormString(formData, "next"));

		if (!email || !token) {
			return fail(400, {
				codeRequested: true,
				email: email ?? "",
				verifyError: "Enter the 6-digit code from your email.",
			});
		}

		const supabase = getSupabaseClient(locals);
		const { error } = await supabase.auth.verifyOtp({
			email,
			token,
			type: "email",
		});

		if (error) {
			return fail(400, {
				codeRequested: true,
				email,
				verifyError: "That code did not work. Check the code and try again.",
			});
		}

		redirect(303, next);
	},
};
