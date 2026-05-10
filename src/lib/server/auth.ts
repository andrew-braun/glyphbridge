import type { SupabaseClient, User } from "@supabase/supabase-js";
import { error } from "@sveltejs/kit";

const allowedRedirectPaths = new Set(["/", "/auth", "/learn", "/alphabet", "/words", "/practice"]);

export function getSupabaseClient(locals: App.Locals): SupabaseClient {
	if (!locals.authConfigured || !locals.supabase) {
		throw error(503, "Authentication is not configured");
	}

	return locals.supabase;
}

export async function requireVerifiedUser(locals: App.Locals): Promise<User> {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw error(401, "Sign in required");
	}

	return user;
}

export async function getVerifiedUser(locals: App.Locals): Promise<User | null> {
	const { user } = await locals.safeGetSession();
	return user;
}

export function getSafeRedirectPath(value: string | null): string {
	if (!value) return "/";

	if (allowedRedirectPaths.has(value)) {
		return value;
	}

	return "/";
}

export function readRequiredFormString(formData: FormData, fieldName: string): string | null {
	const value = formData.get(fieldName);

	if (typeof value !== "string") return null;

	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
}

export function normalizeEmail(value: string | null): string | null {
	if (!value) return null;

	const normalized = value.trim().toLowerCase();

	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? normalized : null;
}

export function normalizeEmailOtp(value: string | null): string | null {
	if (!value) return null;

	const normalized = value.replace(/\D/g, "");

	return /^\d{6}$/.test(normalized) ? normalized : null;
}
