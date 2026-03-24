import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client authenticated with the service-role key.
 *
 * **This client bypasses all Row-Level Security (RLS) policies.**
 * Only call it in server-side code (Server Actions / Route Handlers) and only
 * after you have already verified the requesting user via `getSession()`.
 *
 * @returns A Supabase admin client with full database access.
 */
export function createAdminClient() {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SECRET_KEY!,
	)
}
