import { createServerClient } from "@supabase/ssr";
import type { Handle } from "@sveltejs/kit";

import { env } from "$env/dynamic/private";

type SupabaseAuthConfig = {
	url: string;
	publishableKey: string;
};

function getSupabaseAuthConfig(): SupabaseAuthConfig | null {
	const url = env.SUPABASE_AUTH_URL;
	const publishableKey = env.SUPABASE_AUTH_PUBLISHABLE_KEY;

	if (!url || !publishableKey) return null;

	return { url, publishableKey };
}

export const handle: Handle = async ({ event, resolve }) => {
	const config = getSupabaseAuthConfig();
	const useSecureCookies = event.url.protocol === "https:" || env.NODE_ENV === "production";

	event.locals.authConfigured = config !== null;
	event.locals.supabase = null;
	event.locals.safeGetSession = async () => ({ session: null, user: null });

	if (config) {
		const supabase = createServerClient(config.url, config.publishableKey, {
			cookies: {
				getAll() {
					return event.cookies.getAll();
				},
				setAll(cookiesToSet, headers) {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, {
							...options,
							httpOnly: true,
							path: "/",
							sameSite: options.sameSite ?? "lax",
							secure: options.secure ?? useSecureCookies,
						});
					});

					Object.entries(headers).forEach(([name, value]) => {
						event.setHeaders(name === "set-cookie" ? {} : { [name]: value });
					});
				},
			},
		});

		let safeSessionPromise: Promise<{
			session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"] | null;
			user: Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"] | null;
		}> | null = null;

		event.locals.supabase = supabase;
		event.locals.safeGetSession = async () => {
			safeSessionPromise ??= (async () => {
				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (!session) return { session: null, user: null };

				const {
					data: { user },
					error,
				} = await supabase.auth.getUser();

				if (error || !user) return { session: null, user: null };

				return { session, user };
			})();

			return safeSessionPromise;
		};

		await event.locals.safeGetSession();
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === "content-range" || name === "x-supabase-api-version";
		},
	});
};
