import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			authConfigured: boolean;
			supabase: SupabaseClient | null;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
