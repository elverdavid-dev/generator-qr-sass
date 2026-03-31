'use server'

import { createClient } from '@/shared/lib/supabase/server'

export const updatePassword = async (password: string) => {
	const supabase = await createClient()
	const { error } = await supabase.auth.updateUser({ password })
	if (error) return { error: error.message }
	return { success: true }
}
