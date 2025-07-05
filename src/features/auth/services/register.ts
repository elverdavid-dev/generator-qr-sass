import { createClient } from '@/lib/supabase/server'
import type { AuthFormData } from '../schema/auth-form-data'

export const registerService = async ({ email, password }: AuthFormData) => {
	const supabase = await createClient()
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	})
	if (error) {
		return { error: error.message }
	}
	return { data }
}
