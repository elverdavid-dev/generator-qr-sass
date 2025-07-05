'use server'
import { createClient } from '@/lib/supabase/server'

enum Role {
	ADMIN = 'admin',
	USER = 'user',
}

interface Params {
	id: string
	name?: string
	surname?: string
	phone?: string
	email: string
	avatar_url?: string
	role?: Role
}

export const createProfile = async (profile: Params) => {
	const supabase = await createClient()
	const { data, error } = await supabase.from('profiles').insert([profile])

	if (error) {
		return { error: error.message }
	}
	return { data }
}
