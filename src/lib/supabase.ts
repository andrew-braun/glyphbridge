import { createClient } from '@supabase/supabase-js';

// Supabase configuration — ready for when auth and database features are added.
// For now, the app uses localStorage for progress tracking.
// To connect to Supabase, set these environment variables:
//   PUBLIC_SUPABASE_URL
//   PUBLIC_SUPABASE_ANON_KEY

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = supabaseUrl && supabaseAnonKey
	? createClient(supabaseUrl, supabaseAnonKey)
	: null;
