'use server'

import { createClient } from '@/shared/lib/supabase/server'

export const resetPasswordService = async (email: string) => {
	const supabase = await createClient()
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${baseUrl}/api/auth/confirm?next=/dashboard/profile`,
	})
	if (error) {
		return { error: error.message }
	}
	return {}
}
