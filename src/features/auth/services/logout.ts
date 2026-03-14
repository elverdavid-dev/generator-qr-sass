'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'

export const logoutService = async () => {
	const supabase = await createClient()
	await supabase.auth.signOut()
	redirect('/login')
}
