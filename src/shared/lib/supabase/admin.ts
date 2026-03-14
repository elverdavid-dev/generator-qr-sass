import { createClient } from '@supabase/supabase-js'

// Admin client uses the secret key — bypasses RLS.
// Only use this in Server Actions that already verify the user via getSession().
export function createAdminClient() {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SECRET_KEY!,
	)
}
