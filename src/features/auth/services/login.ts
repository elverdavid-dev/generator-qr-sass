'use server'
import type { AuthFormData } from '@/features/auth/schema/auth-form-data'
import { createClient } from '@/shared/lib/supabase/server'

export const loginService = async ({ email, password }: AuthFormData) => {
	const supabase = await createClient()
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	})
	if (error) {
		return { error: error.message }
	}
	return { data }
}
