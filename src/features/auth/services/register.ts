'use server'

import { createClient } from '@/shared/lib/supabase/server'
import type { AuthFormData } from '../schema/auth-form-data'

export const registerService = async ({ email, password }: AuthFormData) => {
	const supabase = await createClient()
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${baseUrl}/api/auth/confirm?next=/dashboard/qrs`,
		},
	})
	if (error) {
		return { error: error.message }
	}
	return { data }
}
