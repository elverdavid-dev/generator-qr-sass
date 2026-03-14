'use server'

import { createClient } from './server'

export async function getSession() {
	const supabase = await createClient()
	const { data, error } = await supabase.auth.getUser()
	if (error) {
		return { error: error.message }
	}
	return { data }
}
