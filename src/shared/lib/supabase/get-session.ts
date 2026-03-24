'use server'

import { createClient } from './server'

/**
 * Returns the currently authenticated Supabase user (server-side).
 *
 * Uses `supabase.auth.getUser()` which validates the JWT with the Supabase
 * server on every call — safer than `getSession()` which only reads the cookie.
 * Use this whenever you need to trust the user identity (e.g. before writing data).
 *
 * @returns `{ data: { user } }` on success, `{ error: string }` on failure.
 */
export async function getSession() {
	const supabase = await createClient()
	const { data, error } = await supabase.auth.getUser()
	if (error) {
		return { error: error.message }
	}
	return { data }
}
